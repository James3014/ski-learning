import { Controller, Get, Query } from '@nestjs/common';
import { AbilitiesService } from './abilities.service';
import { GetAbilitiesQueryDto } from './abilities.dto';

@Controller('abilities')
export class AbilitiesController {
  constructor(private abilitiesService: AbilitiesService) {}

  @Get()
  async getAbilities(@Query() query: GetAbilitiesQueryDto) {
    return this.abilitiesService.findAbilities(query.sportType, query.skillLevel);
  }
}
