import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ClassEntity } from './class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfService } from 'src/prof/prof.service';
import { ProfModule } from 'src/prof/prof.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([ClassEntity]),
    ProfModule
  ],
  controllers: [ClassController],
  providers: [ClassService],
  exports: [ClassService]
})
export class ClassModule {}
