import { IsString, IsEmail, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class ClaimSeatDto {
  @IsString()
  code: string;

  @IsEmail()
  studentEmail: string;
}

export class SubmitIdentityDto {
  @IsString()
  studentDisplayName: string;

  @IsString()
  @IsOptional()
  studentEnglishName?: string;

  @IsDateString()
  birthDate: string;

  @IsEmail()
  contactEmail: string;

  @IsString()
  contactPhone: string;

  @IsBoolean()
  isMinor: boolean;

  @IsEmail()
  @IsOptional()
  guardianEmail?: string;

  @IsBoolean()
  hasExternalInsurance: boolean;

  @IsString()
  @IsOptional()
  insuranceProvider?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
