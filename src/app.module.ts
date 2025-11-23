import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AbilitiesController } from './abilities/abilities.controller';
import { SeatsController } from './seats/seats.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    AbilitiesController,
    SeatsController,
  ],
})
export class AppModule {}
