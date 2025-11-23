import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ClaimSeatDto, SubmitIdentityDto } from './seats.dto';
import { ERROR_MESSAGES } from '../common/constants';

@Controller('seats')
export class SeatsController {
  constructor(private prisma: PrismaService) {}

  @Get(':code')
  async getSeatByCode(@Param('code') code: string) {
    const invitation = await this.prisma.seatInvitation.findUnique({
      where: { code },
      include: {
        seat: {
          include: {
            lesson: {
              include: {
                resort: true,
                instructor: true,
              },
            },
          },
        },
      },
    });

    if (!invitation) {
      throw new HttpException(ERROR_MESSAGES.INVITATION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (new Date() > invitation.expiresAt) {
      throw new HttpException(ERROR_MESSAGES.INVITATION_EXPIRED, HttpStatus.BAD_REQUEST);
    }

    return {
      code: invitation.code,
      seat: {
        id: invitation.seat.id,
        seatNumber: invitation.seat.seatNumber,
        status: invitation.seat.status,
      },
      lesson: {
        id: invitation.seat.lesson.id,
        date: invitation.seat.lesson.date,
        resort: invitation.seat.lesson.resort.name,
      },
      expiresAt: invitation.expiresAt,
    };
  }

  @Post('claim')
  async claimSeat(@Body() dto: ClaimSeatDto) {
    const invitation = await this.prisma.seatInvitation.findUnique({
      where: { code: dto.code },
      include: { 
        seat: {
          include: {
            lesson: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new HttpException(ERROR_MESSAGES.INVITATION_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (invitation.claimedAt) {
      throw new HttpException(ERROR_MESSAGES.SEAT_ALREADY_CLAIMED, HttpStatus.BAD_REQUEST);
    }

    if (new Date() > invitation.expiresAt) {
      throw new HttpException(ERROR_MESSAGES.INVITATION_EXPIRED, HttpStatus.BAD_REQUEST);
    }

    return await this.prisma.$transaction(async (tx) => {
      let student = await tx.globalStudent.findFirst({
        where: { email: dto.studentEmail },
      });

      if (!student) {
        student = await tx.globalStudent.create({
          data: {
            email: dto.studentEmail,
            phone: '',
            birthDate: new Date(),
          },
        });
      }

      const mapping = await tx.studentMapping.create({
        data: {
          globalStudentId: student.id,
          resortId: invitation.seat.lesson.resortId,
        },
      });

      await tx.orderSeat.update({
        where: { id: invitation.seatId },
        data: {
          status: 'claimed',
          claimedMappingId: mapping.id,
          claimedAt: new Date(),
        },
      });

      await tx.seatInvitation.update({
        where: { code: dto.code },
        data: {
          claimedAt: new Date(),
          claimedBy: mapping.id,
        },
      });

      return {
        message: '席位認領成功',
        seatId: invitation.seatId,
        studentId: student.id,
      };
    });
  }

  @Post(':id/identity')
  async submitIdentity(@Param('id') seatId: string, @Body() dto: SubmitIdentityDto) {
    const seat = await this.prisma.orderSeat.findUnique({
      where: { id: seatId },
    });

    if (!seat) {
      throw new HttpException(ERROR_MESSAGES.SEAT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const form = await this.prisma.seatIdentityForm.create({
      data: {
        seatId,
        status: 'submitted',
        studentDisplayName: dto.studentDisplayName,
        birthDate: new Date(dto.birthDate),
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        isMinor: dto.isMinor,
        guardianEmail: dto.guardianEmail,
        hasExternalInsurance: dto.hasExternalInsurance,
        insuranceProvider: dto.insuranceProvider,
        note: dto.note,
        submittedAt: new Date(),
      },
    });

    return {
      message: '身份表單提交成功',
      formId: form.id,
    };
  }
}
