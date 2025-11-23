import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbilityCatalog, SportType } from '../database/entities/ability-catalog.entity';

@Injectable()
export class AbilitiesService {
  constructor(
    @InjectRepository(AbilityCatalog)
    private abilityRepo: Repository<AbilityCatalog>,
  ) {}

  async findAbilities(sportType?: string, skillLevel?: string) {
    const where: any = {};

    if (sportType) {
      where.sportType = sportType as SportType;
    }

    if (skillLevel) {
      where.skillLevel = parseInt(skillLevel);
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
