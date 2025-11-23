import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AbilitiesController } from './abilities/abilities.controller';
import { SeatsController } from './seats/seats.controller';
import { DatabaseModule } from './database/database.module';
import { AbilitiesService } from './abilities/abilities.service';
import { SeatsService } from './seats/seats.service';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    AbilitiesController,
    SeatsController,
  ],
  providers: [
    AbilitiesService,
    SeatsService,
  ],
})
export class AppModule {}
