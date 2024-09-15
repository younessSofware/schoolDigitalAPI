import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { ProfRepository } from './prof.repository';
import { ProfEntity } from './prof.entity';
import { ProfService } from './prof.service';
import { ProfController } from './prof.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfRepository, ProfEntity]),
    AccountModule,
  ],
  providers: [ProfService],
  controllers: [ProfController],
  exports: [ProfService],

})
export class ProfModule {}
