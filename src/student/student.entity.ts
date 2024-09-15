import { ClassEntity } from 'src/class/class.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('student_entity')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  adresse: string;

  @Column()
  phone_number: string;

  @ManyToMany(() => ClassEntity, (classEntity) => classEntity.students)
  @JoinTable({ name: 'class_student_entity' })
  classes: ClassEntity[];
    classCount?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
