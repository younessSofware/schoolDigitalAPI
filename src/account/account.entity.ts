import { Exclude } from 'class-transformer';
import { AccountRole } from 'src/common/enum/account-role.enum';
import { AccountState } from 'src/common/enum/account-state.enum';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('accounts')
export class AccountEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 150,
    nullable: false,
  })
  fullname: string;

  @Column({
    length: 150,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column()
  @Exclude()
  salt: string;

  @Column({
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: AccountRole,
  })
  role: AccountRole;

  @Column({
    type: 'enum',
    enum: AccountState,
    default: AccountState.CREATED,
  })
  state: AccountState;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
