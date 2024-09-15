import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountEntity } from './account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[
    TypeOrmModule.forFeature([AccountEntity]),

  ],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],

})
export class AccountModule {}
