import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';

@Entity('instructors')
export class Instructor {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'can_view_shared_records', default: false })
  canViewSharedRecords: boolean;

  @OneToMany(() => Lesson, lesson => lesson.instructor)
  lessons: Lesson[];
}
