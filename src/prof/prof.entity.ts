import { AccountEntity } from 'src/account/account.entity';
import { ClassEntity } from 'src/class/class.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class ProfEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullname: string;

  @Column()
  phone_number: string;

  @Column()
  adresse: string;

  @Column({
    type: 'decimal', // This ensures the column can store decimal values
    precision: 5, // Total number of digits, including both sides of the decimal point
    scale: 2, // Number of digits to the right of the decimal point
  })
  teacher_share_percentage: number;

  @OneToMany(() => ClassEntity, (classEntity) => classEntity.teacher)
  classes: ClassEntity[];
  classCount?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // @OneToOne(() => AccountEntity, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  //   cascade: true,
  //   eager: true,
  // })
  // @JoinColumn()
  // account: AccountEntity;
}
