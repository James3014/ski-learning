import { Entity, PrimaryColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { GlobalStudent } from './global-student.entity';
import { Resort } from './resort.entity';
import { OrderSeat } from './order-seat.entity';

@Entity('student_mappings')
export class StudentMapping {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'global_student_id' })
  globalStudentId: string;

  @Column({ name: 'resort_id' })
  resortId: number;

  @ManyToOne(() => GlobalStudent, student => student.mappings)
  @JoinColumn({ name: 'global_student_id' })
  globalStudent: GlobalStudent;

  @ManyToOne(() => Resort, resort => resort.studentMappings)
  @JoinColumn({ name: 'resort_id' })
  resort: Resort;

  @OneToMany(() => OrderSeat, seat => seat.claimedMapping)
  claimedSeats: OrderSeat[];
}
