import { Entity, PrimaryColumn, Column, ManyToOne, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Lesson } from './lesson.entity';
import { StudentMapping } from './student-mapping.entity';
import { SeatInvitation } from './seat-invitation.entity';
import { SeatIdentityForm } from './seat-identity-form.entity';

export enum SeatStatus {
  PENDING = 'pending',
  INVITED = 'invited',
  CLAIMED = 'claimed',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

@Entity('order_seats')
export class OrderSeat {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'lesson_id' })
  lessonId: number;

  @Column({ name: 'seat_number' })
  seatNumber: number;

  @Column({ name: 'claimed_mapping_id', nullable: true })
  claimedMappingId: string;

  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.PENDING })
  status: SeatStatus;

  @Column({ name: 'claimed_at', type: 'timestamptz', nullable: true })
  claimedAt: Date;

  @Column({ default: 1 })
  version: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => Lesson, lesson => lesson.seats)
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @ManyToOne(() => StudentMapping, { nullable: true })
  @JoinColumn({ name: 'claimed_mapping_id' })
  claimedMapping: StudentMapping;

  @OneToOne(() => SeatInvitation, invitation => invitation.seat)
  invitation: SeatInvitation;

  @OneToOne(() => SeatIdentityForm, form => form.seat)
  identityForm: SeatIdentityForm;
}
