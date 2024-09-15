import { Exclude } from 'class-transformer';
import { AccountRole } from 'src/common/enum/account-role.enum';
import { AccountState } from 'src/common/enum/account-state.enum';
import { ProfEntity } from 'src/prof/prof.entity';
import { StudentEntity } from 'src/student/student.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('class_entity')
export class ClassEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      length: 150,
      nullable: false,
    })
    name: string;
  
    @Column()
    study_material: string;
  
    @Column()
    academic_year: string;
  
    @Column({ default: true })
    is_academic: boolean;
  
    @Column({ type: 'int' })
    nbr_max_student: number;

    @Column({ type: 'decimal'})
    monthly_fee: number;

    @ManyToOne(() => ProfEntity, (professor) => professor.classes)
    teacher: ProfEntity;
    
    @ManyToMany(() => StudentEntity, (studentEntity) => studentEntity.classes)
    students: StudentEntity[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }
