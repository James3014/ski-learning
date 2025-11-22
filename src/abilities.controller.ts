import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('abilities')
export class AbilitiesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getAbilities(
    @Query('sportType') sportType?: string,
    @Query('skillLevel') skillLevel?: string,
  ) {
    const where: any = {};
    
    if (sportType) {
      where.sportType = sportType;
    }
    
    if (skillLevel) {
      where.skillLevel = parseInt(skillLevel);
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
