import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { StudentMapping } from './student-mapping.entity';
import { GuardianRelationship } from './guardian-relationship.entity';

@Entity('global_students')
export class GlobalStudent {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ name: 'birth_date', type: 'date' })
  birthDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @OneToMany(() => StudentMapping, mapping => mapping.globalStudent)
  mappings: StudentMapping[];

  @OneToMany(() => GuardianRelationship, relationship => relationship.student)
  guardianRelationships: GuardianRelationship[];
}
