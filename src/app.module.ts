import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MigrationController } from './migration.controller';
import { AbilitiesController } from './abilities.controller';
import { SeatsController } from './seats.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    MigrationController,
    AbilitiesController,
    SeatsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
