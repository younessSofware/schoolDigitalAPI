import { EntityRepository } from 'typeorm';
import { Entity, Repository } from 'typeorm';
import {  ProfEntity } from './prof.entity';

@EntityRepository(ProfEntity)
export class ProfRepository extends Repository<ProfEntity> {

}