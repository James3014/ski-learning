import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { OrderSeat } from './order-seat.entity';

export enum SeatIdentityStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  CONFIRMED = 'confirmed',
}

@Entity('seat_identity_forms')
export class SeatIdentityForm {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'seat_id', unique: true })
  seatId: string;

  @Column({ type: 'enum', enum: SeatIdentityStatus, default: SeatIdentityStatus.DRAFT })
  status: SeatIdentityStatus;

  @Column({ name: 'student_display_name' })
  studentDisplayName: string;

  @Column({ name: 'student_english_name', nullable: true })
  studentEnglishName: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @Column({ name: 'contact_email' })
  contactEmail: string;

  @Column({ name: 'guardian_email', nullable: true })
  guardianEmail: string;

  @Column({ name: 'contact_phone' })
  contactPhone: string;

  @Column({ name: 'is_minor' })
  isMinor: boolean;

  @Column({ name: 'has_external_insurance' })
  hasExternalInsurance: boolean;

  @Column({ name: 'insurance_provider', nullable: true })
  insuranceProvider: string;

  @Column({ nullable: true })
  note: string;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt: Date;

  @Column({ name: 'confirmed_at', type: 'timestamptz', nullable: true })
  confirmedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => OrderSeat, seat => seat.identityForm)
  @JoinColumn({ name: 'seat_id' })
  seat: OrderSeat;
}
