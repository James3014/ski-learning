import { Controller, Get, Post, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma.service';

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
      throw new HttpException('邀請碼不存在', HttpStatus.NOT_FOUND);
    }

    if (new Date() > invitation.expiresAt) {
      throw new HttpException('邀請碼已過期', HttpStatus.BAD_REQUEST);
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
  async claimSeat(@Body() body: { code: string; studentEmail: string }) {
    const { code, studentEmail } = body;

    const invitation = await this.prisma.seatInvitation.findUnique({
      where: { code },
      include: { seat: true },
    });

    if (!invitation) {
      throw new HttpException('邀請碼不存在', HttpStatus.NOT_FOUND);
    }

    if (invitation.claimedAt) {
      throw new HttpException('席位已被認領', HttpStatus.BAD_REQUEST);
    }

    if (new Date() > invitation.expiresAt) {
      throw new HttpException('邀請碼已過期', HttpStatus.BAD_REQUEST);
    }

    // 建立或查找學生
    let student = await this.prisma.globalStudent.findFirst({
      where: { email: studentEmail },
    });

    if (!student) {
      student = await this.prisma.globalStudent.create({
        data: {
          email: studentEmail,
          phone: '',
          birthDate: new Date(),
        },
      });
    }

    // 建立學生映射
    const mapping = await this.prisma.studentMapping.create({
      data: {
        globalStudentId: student.id,
        resortId: 1, // 暫時固定
      },
    });

    // 更新席位和邀請碼
    await this.prisma.orderSeat.update({
      where: { id: invitation.seatId },
      data: {
        status: 'claimed',
        claimedMappingId: mapping.id,
        claimedAt: new Date(),
      },
    });

    await this.prisma.seatInvitation.update({
      where: { code },
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
  }

  @Post(':id/identity')
  async submitIdentity(
    @Param('id') seatId: string,
    @Body() body: {
      studentDisplayName: string;
      birthDate: string;
      contactEmail: string;
      contactPhone: string;
      isMinor: boolean;
      guardianEmail?: string;
      hasExternalInsurance: boolean;
      insuranceProvider?: string;
      note?: string;
    },
  ) {
    const seat = await this.prisma.orderSeat.findUnique({
      where: { id: seatId },
    });

    if (!seat) {
      throw new HttpException('席位不存在', HttpStatus.NOT_FOUND);
    }

    const form = await this.prisma.seatIdentityForm.create({
      data: {
        seatId,
        status: 'submitted',
        studentDisplayName: body.studentDisplayName,
        birthDate: new Date(body.birthDate),
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        isMinor: body.isMinor,
        guardianEmail: body.guardianEmail,
        hasExternalInsurance: body.hasExternalInsurance,
        insuranceProvider: body.insuranceProvider,
        note: body.note,
        submittedAt: new Date(),
      },
    });

    return {
      message: '身份表單提交成功',
      formId: form.id,
    };
  }
}
