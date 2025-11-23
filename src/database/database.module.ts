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

// Build connection URL from Zeabur environment variables if available
const getDatabaseUrl = () => {
  if (process.env.DIRECT_URL) {
    return process.env.DIRECT_URL;
  }
  
  // Zeabur auto-injected PostgreSQL variables
  const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USERNAME, POSTGRES_PASSWORD, POSTGRES_DATABASE } = process.env;
  if (POSTGRES_HOST && POSTGRES_USERNAME && POSTGRES_PASSWORD && POSTGRES_DATABASE) {
    return `postgresql://${POSTGRES_USERNAME}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT || 5432}/${POSTGRES_DATABASE}`;
  }
  
  return process.env.DATABASE_URL;
};

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: getDatabaseUrl(),
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
