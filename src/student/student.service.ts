import { ClassService } from './../class/class.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentEntity } from './student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentRequestDto } from './dtos/student-create.dto';
import { StudentRepository } from './student.repository';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: StudentRepository,
    private readonly classService: ClassService,
  ) {}

  async create(request: CreateStudentRequestDto) {
    const student = this.studentRepository.create(request);

    // Initialize the classes array if it isn't already
    student.classes = [];
    
    for (const class_id of request.class_ids) {

      const classe = await this.classService.getOne(class_id);
      if (!classe) {
        throw new NotFoundException(`this id ${class_id} not found`);
      }
      student.classes.push(classe);
    }

    return this.studentRepository.save(student);
  }

  async update(id: number, studentBody: CreateStudentRequestDto) {
    const foundStudent = await this.getOne(id);
    if (!foundStudent) {
      throw new NotFoundException(`this id ${id} not found`);
    }
    if (studentBody.fullname) foundStudent.fullname = studentBody.fullname;
    if (studentBody.adresse) foundStudent.adresse = studentBody.adresse;
    if (studentBody.phone_number)
      studentBody.phone_number = studentBody.phone_number;
    if (studentBody.class_ids && studentBody.class_ids.length) {
      foundStudent.classes = [];
      for (const class_id of studentBody.class_ids) {
        const classe = await this.classService.getOne(class_id);
        if (!classe) {
          throw new NotFoundException(`this id ${id} not found`);
        }
        foundStudent.classes.push(classe);
      }
    }

    return await this.studentRepository.save(foundStudent);
  }

  async getOne(id: number): Promise<any> {
    const found = await this.studentRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`this id ${id} not found`);
    }
    return found;
  }

  async getAll(
    skip: number,
    take: number,
    sortField?: string,
    sortDirection?: number,
  ): Promise<any> {
    const obj: any = { skip, take };
    if (sortField) {
      obj.order = {
        [sortField]: sortDirection == 1 ? 'ASC' : 'DESC',
      };
    }

    const count = await this.studentRepository.count();

    const students = await this.studentRepository
      .createQueryBuilder('student')
      .skip(skip)
      .take(take)
      .orderBy(
        sortField ? sortField : null,
        sortDirection == 1 ? 'ASC' : 'DESC',
      )
      .loadRelationCountAndMap('student.classCount', 'student.classes')

      .getMany();

    const data = students.map((student) => ({
      ...student,
      classCount: student.classCount,
    }));

    return { count, data };
  }

  async delete(id: number) {
    const found = await this.studentRepository.delete({ id });
    if (!found) {
      throw new NotFoundException(`this id ${id} not found`);
    }
    return found;
  }
}
