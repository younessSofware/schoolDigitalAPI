import { AuthService } from 'src/auth/auth.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfCreateDto } from './prof.create-dto';
import { ProfDto } from './prof.dto';
import { ProfEntity } from './prof.entity';
import { AccountService } from 'src/account/account.service';
import { AccountRole } from 'src/common/enum/account-role.enum';

@Injectable()
export class ProfService {
  constructor(
    @InjectRepository(ProfEntity)
    private profRepository: Repository<ProfEntity>,
    private accountService: AccountService,
  ) {}

  async createProf(authorCreateDto: ProfCreateDto): Promise<any> {
    let prof = new ProfEntity();

    prof.fullname = authorCreateDto.fullname;
    prof.adresse = authorCreateDto.adresse;
    prof.phone_number = authorCreateDto.phone_number;
    prof.teacher_share_percentage = authorCreateDto.teacher_share_percentage;

    prof = await this.profRepository.save(prof);

    return prof;
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

    const count = await this.profRepository.count();

    const profs = await this.profRepository
      .createQueryBuilder('prof')
      .skip(skip)
      .take(take)
      .orderBy(
        sortField ? sortField : null,
        sortDirection == 1 ? 'ASC' : 'DESC',
      )
      .loadRelationCountAndMap('prof.classCount', 'prof.classes')

      .getMany();

    const data = profs.map((prof) => ({
      ...prof,
      classCount: prof.classCount,
    }));

    return { count, data };
  }

  async getOne(id: number): Promise<any> {
    const found = await this.profRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`this id ${id} not found`);
    }
    return found;
  }

  async update(id: number, profBody: ProfCreateDto) {
    const foundProf = await this.profRepository.findOneBy({ id });
    if (!foundProf) {
      throw new NotFoundException(`this id ${id} not found`);
    }
    if (profBody.fullname) foundProf.fullname = profBody.fullname;
    if (profBody.adresse) foundProf.adresse = profBody.adresse;
    if (profBody.phone_number) foundProf.phone_number = profBody.phone_number;
    if (profBody.teacher_share_percentage)
      foundProf.teacher_share_percentage = profBody.teacher_share_percentage;

    return await this.profRepository.save(foundProf);
  }

  async delete(id: number) {
    const found = await this.profRepository.delete({ id });
    if (!found) {
      throw new NotFoundException(`this id ${id} not found`);
    }
    return found;
  }
}
