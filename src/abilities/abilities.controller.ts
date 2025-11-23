import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { GetAbilitiesQueryDto } from './abilities.dto';

@Controller('abilities')
export class AbilitiesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAbilities(@Query() query: GetAbilitiesQueryDto) {
    const where: any = {};
    
    if (query.sportType) {
      where.sportType = query.sportType;
    }
    
    if (query.skillLevel) {
      where.skillLevel = parseInt(query.skillLevel);
    }

    const abilities = await this.prisma.abilityCatalog.findMany({
      where,
      orderBy: [
        { skillLevel: 'asc' },
        { sequenceInLevel: 'asc' },
      ],
    });

    return {
      total: abilities.length,
      data: abilities,
    };
  }
}
