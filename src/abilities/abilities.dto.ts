import { IsOptional, IsEnum, IsNumberString } from 'class-validator';
import { SportType } from '@prisma/client';

export class GetAbilitiesQueryDto {
  @IsOptional()
  @IsEnum(SportType)
  sportType?: SportType;

  @IsOptional()
  @IsNumberString()
  skillLevel?: string;
}
