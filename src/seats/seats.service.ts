import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SeatInvitation } from '../database/entities/seat-invitation.entity';
import { OrderSeat } from '../database/entities/order-seat.entity';
import { GlobalStudent } from '../database/entities/global-student.entity';
import { StudentMapping } from '../database/entities/student-mapping.entity';
import { SeatIdentityForm } from '../database/entities/seat-identity-form.entity';
import { ERROR_MESSAGES } from '../common/constants';

@Injectable()
export class SeatsService {
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

  async findSeatByCode(code: string) {
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

  async claimSeat(code: string, studentEmail: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { code },
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
        where: { email: studentEmail },
      });

      if (!student) {
        student = manager.create(GlobalStudent, {
          id: `student-${Date.now()}`,
          email: studentEmail,
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

      await manager.update(SeatInvitation, code, {
        claimedAt: new Date(),
        claimedBy: studentEmail,
      });

      return {
        success: true,
        seatId: invitation.seatId,
        message: 'Seat claimed successfully',
      };
    });
  }

  async submitIdentity(seatId: string, data: {
    studentDisplayName: string;
    studentEnglishName?: string;
    birthDate: string;
    contactEmail: string;
    guardianEmail?: string;
    contactPhone: string;
    isMinor: boolean;
    hasExternalInsurance: boolean;
    insuranceProvider?: string;
    note?: string;
  }) {
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
        studentDisplayName: data.studentDisplayName,
        studentEnglishName: data.studentEnglishName,
        birthDate: new Date(data.birthDate),
        contactEmail: data.contactEmail,
        guardianEmail: data.guardianEmail,
        contactPhone: data.contactPhone,
        isMinor: data.isMinor,
        hasExternalInsurance: data.hasExternalInsurance,
        insuranceProvider: data.insuranceProvider,
        note: data.note,
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
