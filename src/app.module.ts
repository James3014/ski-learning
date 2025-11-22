import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MigrationController } from './migration.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController, MigrationController],
  providers: [PrismaService],
})
export class AppModule {}
