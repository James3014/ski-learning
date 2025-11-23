import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Resort } from './resort.entity';
import { Instructor } from './instructor.entity';
import { OrderSeat } from './order-seat.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resort_id' })
  resortId: number;

  @Column({ name: 'instructor_id' })
  instructorId: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Resort, resort => resort.lessons)
  @JoinColumn({ name: 'resort_id' })
  resort: Resort;

  @ManyToOne(() => Instructor, instructor => instructor.lessons)
  @JoinColumn({ name: 'instructor_id' })
  instructor: Instructor;

  @OneToMany(() => OrderSeat, seat => seat.lesson)
  seats: OrderSeat[];
}
