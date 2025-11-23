import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SeatInvitation } from '../database/entities/seat-invitation.entity';
import { OrderSeat } from '../database/entities/order-seat.entity';
import { GlobalStudent } from '../database/entities/global-student.entity';
import { StudentMapping } from '../database/entities/student-mapping.entity';
import { SeatIdentityForm } from '../database/entities/seat-identity-form.entity';
import { ClaimSeatDto, SubmitIdentityDto } from './seats.dto';
import { ERROR_MESSAGES } from '../common/constants';

@Controller('seats')
export class SeatsController {
  constructor(
    @InjectRepository(SeatInvitation)
    private invitationRepo: Repository<SeatInvitation>,
    @InjectRepository(OrderSeat)
    private seatRepo: Repository<OrderSeat>,
    @InjectRepository(GlobalStudent)
    private studentRepo: Repository<GlobalStudent>,
    @InjectRepository(StudentMapping)
    private mappingRepo: Repository<StudentMapping>,
    @InjectRepository(SeatIdentityForm)
    private formRepo: Repository<SeatIdentityForm>,
    private dataSource: DataSource,
  ) {}

  @Get(':code')
  async getSeatByCode(@Param('code') code: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { code },
      relations: {
        seat: {
          lesson: {
            resort: true,
            instructor: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new HttpException(ERROR_MESSAGES.INVITATION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return {
      code: invitation.code,
      expiresAt: invitation.expiresAt,
      seat: {
        id: invitation.seat.id,
        seatNumber: invitation.seat.seatNumber,
        status: invitation.seat.status,
        lesson: {
          id: invitation.seat.lesson.id,
          date: invitation.seat.lesson.date,
          resort: {
            id: invitation.seat.lesson.resort.id,
            name: invitation.seat.lesson.resort.name,
            location: invitation.seat.lesson.resort.location,
          },
        },
      },
    };
  }

  @Post('claim')
  async claimSeat(@Body() dto: ClaimSeatDto) {
    const invitation = await this.invitationRepo.findOne({
      where: { code: dto.code },
      relations: {
        seat: {
          lesson: true,
        },
      },
    });

    if (!invitation) {
      throw new HttpException(ERROR_MESSAGES.INVITATION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (invitation.claimedAt) {
      throw new HttpException(ERROR_MESSAGES.SEAT_ALREADY_CLAIMED, HttpStatus.CONFLICT);
    }

    if (new Date() > invitation.expiresAt) {
      throw new HttpException(ERROR_MESSAGES.INVITATION_EXPIRED, HttpStatus.GONE);
    }

    return await this.dataSource.transaction(async (manager) => {
      let student = await manager.findOne(GlobalStudent, {
        where: { email: dto.studentEmail },
      });

      if (!student) {
        student = manager.create(GlobalStudent, {
          id: `student-${Date.now()}`,
          email: dto.studentEmail,
          phone: '',
          birthDate: new Date(),
        });
        await manager.save(student);
      }

      const resortId = invitation.seat.lesson.resortId;

      let mapping = await manager.findOne(StudentMapping, {
        where: {
          globalStudentId: student.id,
          resortId: resortId,
        },
      });

      if (!mapping) {
        mapping = manager.create(StudentMapping, {
          id: `mapping-${Date.now()}`,
          globalStudentId: student.id,
          resortId: resortId,
        });
        await manager.save(mapping);
      }

      await manager.update(OrderSeat, invitation.seatId, {
        claimedMappingId: mapping.id,
        status: 'claimed' as any,
        claimedAt: new Date(),
      });

      await manager.update(SeatInvitation, dto.code, {
        claimedAt: new Date(),
        claimedBy: dto.studentEmail,
      });

      return {
        success: true,
        seatId: invitation.seatId,
        message: 'Seat claimed successfully',
      };
    });
  }

  @Post(':id/identity')
  async submitIdentity(@Param('id') seatId: string, @Body() dto: SubmitIdentityDto) {
    const seat = await this.seatRepo.findOne({
      where: { id: seatId },
    });

    if (!seat) {
      throw new HttpException(ERROR_MESSAGES.SEAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const form = await this.formRepo.save(
      this.formRepo.create({
        id: `form-${Date.now()}`,
        seatId,
        status: 'submitted' as any,
        studentDisplayName: dto.studentDisplayName,
        studentEnglishName: dto.studentEnglishName,
        birthDate: new Date(dto.birthDate),
        contactEmail: dto.contactEmail,
        guardianEmail: dto.guardianEmail,
        contactPhone: dto.contactPhone,
        isMinor: dto.isMinor,
        hasExternalInsurance: dto.hasExternalInsurance,
        insuranceProvider: dto.insuranceProvider,
        note: dto.note,
        submittedAt: new Date(),
      }),
    );

    return {
      success: true,
      formId: form.id,
      message: 'Identity form submitted successfully',
    };
  }
}
