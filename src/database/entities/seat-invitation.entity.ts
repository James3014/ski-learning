import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { OrderSeat } from './order-seat.entity';

@Entity('seat_invitations')
export class SeatInvitation {
  @PrimaryColumn()
  code: string;

  @Column({ name: 'seat_id', unique: true })
  seatId: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'claimed_at', type: 'timestamptz', nullable: true })
  claimedAt: Date;

  @Column({ name: 'claimed_by', nullable: true })
  claimedBy: string;

  @OneToOne(() => OrderSeat, seat => seat.invitation)
  @JoinColumn({ name: 'seat_id' })
  seat: OrderSeat;
}
