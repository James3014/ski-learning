import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { GlobalStudent } from './global-student.entity';

@Entity('guardian_relationships')
export class GuardianRelationship {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'guardian_email' })
  guardianEmail: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'relationship_type' })
  relationshipType: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(() => GlobalStudent, student => student.guardianRelationships)
  @JoinColumn({ name: 'student_id' })
  student: GlobalStudent;
}
