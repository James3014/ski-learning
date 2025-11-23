import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { ClaimSeatDto, SubmitIdentityDto } from './seats.dto';

@Controller('seats')
export class SeatsController {
  constructor(private seatsService: SeatsService) {}

  @Get(':code')
  async getSeatByCode(@Param('code') code: string) {
    return this.seatsService.findSeatByCode(code);
  }

  @Post('claim')
  async claimSeat(@Body() dto: ClaimSeatDto) {
    return this.seatsService.claimSeat(dto.code, dto.studentEmail);
  }

  @Post(':id/identity')
  async submitIdentity(@Param('id') seatId: string, @Body() dto: SubmitIdentityDto) {
    return this.seatsService.submitIdentity(seatId, dto);
  }
}
