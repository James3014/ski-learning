import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SportType {
  SKI = 'ski',
  SNOWBOARD = 'snowboard',
}

@Entity('ability_catalog')
export class AbilityCatalog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ name: 'sport_type', type: 'enum', enum: SportType })
  sportType: SportType;

  @Column({ name: 'skill_level' })
  skillLevel: number;

  @Column({ name: 'sequence_in_level' })
  sequenceInLevel: number;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
