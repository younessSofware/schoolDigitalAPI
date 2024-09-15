import { EntityRepository } from 'typeorm';
import { Entity, Repository } from 'typeorm';
import { ClassEntity } from './class.entity';

@EntityRepository(ClassEntity)
export class ClassRepository extends Repository<ClassEntity> {

}