import { Controller, Get, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbilityCatalog, SportType } from '../database/entities/ability-catalog.entity';
import { GetAbilitiesQueryDto } from './abilities.dto';

@Controller('abilities')
export class AbilitiesController {
  constructor(
    @InjectRepository(AbilityCatalog)
    private abilityRepo: Repository<AbilityCatalog>,
  ) {}

  @Get()
  async getAbilities(@Query() query: GetAbilitiesQueryDto) {
    const where: any = {};

    if (query.sportType) {
      where.sportType = query.sportType as SportType;
    }

    if (query.skillLevel) {
      where.skillLevel = parseInt(query.skillLevel);
    }

    const abilities = await this.abilityRepo.find({
      where,
      order: {
        sportType: 'ASC',
        skillLevel: 'ASC',
        sequenceInLevel: 'ASC',
      },
    });

    return {
      total: abilities.length,
      data: abilities,
    };
  }
}
