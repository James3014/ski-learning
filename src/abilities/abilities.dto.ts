import { IsOptional, IsString, IsIn } from 'class-validator';

export class GetAbilitiesQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['ski', 'snowboard'])
  sportType?: string;

  @IsOptional()
  @IsString()
  skillLevel?: string;
}
