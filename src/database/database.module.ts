import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resort } from './entities/resort.entity';
import { Instructor } from './entities/instructor.entity';
import { Lesson } from './entities/lesson.entity';
import { OrderSeat } from './entities/order-seat.entity';
import { SeatInvitation } from './entities/seat-invitation.entity';
import { GlobalStudent } from './entities/global-student.entity';
import { StudentMapping } from './entities/student-mapping.entity';
import { GuardianRelationship } from './entities/guardian-relationship.entity';
import { SeatIdentityForm } from './entities/seat-identity-form.entity';
import { AbilityCatalog } from './entities/ability-catalog.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
      entities: [
        Resort,
        Instructor,
        Lesson,
        OrderSeat,
        SeatInvitation,
        GlobalStudent,
        StudentMapping,
        GuardianRelationship,
        SeatIdentityForm,
        AbilityCatalog,
      ],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([
      Resort,
      Instructor,
      Lesson,
      OrderSeat,
      SeatInvitation,
      GlobalStudent,
      StudentMapping,
      GuardianRelationship,
      SeatIdentityForm,
      AbilityCatalog,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
