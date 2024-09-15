import { Injectable, NotFoundException } from '@nestjs/common';
import { ClassEntity } from './class.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassRepository } from './class.repository';
import { CreateClassRequestDto } from './dtos/create-class.dto';
import { ProfService } from 'src/prof/prof.service';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepository: ClassRepository,
    private readonly profService: ProfService,
  ) {}

  async createClass(request: CreateClassRequestDto) {
    const classe = this.classRepository.create(request);
    
    const teacher = await this.profService.getOne(request.teacher_id);
    if (!teacher) throw new NotFoundException('errors.teacher_not_found');
    classe.teacher = teacher;
    return this.classRepository.save(classe);
  }

  async updateClass(id: number, classBody: CreateClassRequestDto) {
    const classFounded = await this.classRepository.findOneBy({ id });
    if (!classFounded) {
      throw new NotFoundException(`this id ${id} not found`);
    }
    if (classBody.name) classFounded.name = classBody.name;
    if (classBody.study_material)
      classFounded.study_material = classBody.study_material;
    if (classBody.nbr_max_student)
      classFounded.nbr_max_student = classBody.nbr_max_student;
    if (classBody.is_academic) classFounded.is_academic = classBody.is_academic;
    if (classBody.monthly_fee) classFounded.monthly_fee = classBody.monthly_fee;
    if (classBody.teacher_id) {
      const teacher = await this.profService.getOne(classBody.teacher_id);
      if (!teacher) throw new NotFoundException('errors.teacher_not_found');
      classFounded.teacher = teacher;
    }

    return await this.classRepository.save(classFounded);
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

    obj['relations'] = ['teacher'];
    // @JoinColumn()
    // account: AccountEntity;

    const count = await this.classRepository.count();
    const classes = await this.classRepository.find(obj);

    const data = classes.map((classe) => ({
      ...classe,
    }));
    return { count, data };
  }

  async getOne(id: number): Promise<any> {
    
    const found = await this.classRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`this id ${id} not found`);
    }
    return found;
  }

}
