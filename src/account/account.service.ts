import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { AccountEntity } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRole } from 'src/common/enum/account-role.enum';
import { CreateAccountRequestDto } from './dtos/create-account.dto';
import { AccountState } from 'src/common/enum/account-state.enum';
import * as bcrypt from 'bcrypt';
import { UpdateAccountRequestDto } from './dtos/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: AccountRepository,
  ) {}

  async findAdmin() {
    const admins = await this.accountRepository.find({
      where: {
        role: AccountRole.ADMIN,
      },
    });

    return admins;
  }

  createAdmin(request: CreateAccountRequestDto) {
    const account = this.accountRepository.create(request);

    account.role = AccountRole.ADMIN;
    account.salt = bcrypt.genSaltSync();
    account.password = bcrypt.hashSync(account.password, account.salt);
    account.state = AccountState.ENABLED;

    return this.accountRepository.save(account);
  }

  async findOneByEmail(email: string) {
    const account = await this.accountRepository.findOne({ where: { email } });
    if (!account) throw new NotFoundException('errors.account_email_not_found');

    return account;
  }

  async updateAdmin(id: number, request: any) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');

    if (request.email) account.email = request.email;
    if (request.fullname) account.fullname = request.fullname;

    return await this.accountRepository.save(account);
  }

  async updateState(id: number, state: AccountState) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');

    if (state && Object.values(AccountState).includes(state)) {
      account.state = state;
    }
    return await this.accountRepository.save(account);
  }

  async findOneById(id: number) {
    const account = await this.accountRepository.findOne({ where: { id } });
    if (!account) throw new NotFoundException('Account not found');
    return account;
  }

  async deleteAdmin(id: number) {
    const account = await this.findOneById(id);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    try {
      await this.accountRepository.softDelete(id);
    } catch (error) {
      // Handle the error appropriately
      console.error('Error during account soft deletion:', error);
      // throw new InternalServerErrorException('Failed to delete the account');
    }
  }
}
