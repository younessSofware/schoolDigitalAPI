import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentEntity } from './student.entity';
import { ClassModule } from 'src/class/class.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([StudentEntity]),
    ClassModule
  ],
  controllers: [StudentController],
  providers: [StudentService]
})
export class StudentModule {}
