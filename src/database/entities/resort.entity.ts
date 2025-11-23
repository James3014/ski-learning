import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lesson } from './lesson.entity';
import { StudentMapping } from './student-mapping.entity';

@Entity('resorts')
export class Resort {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @OneToMany(() => Lesson, lesson => lesson.resort)
  lessons: Lesson[];

  @OneToMany(() => StudentMapping, mapping => mapping.resort)
  studentMappings: StudentMapping[];
}
