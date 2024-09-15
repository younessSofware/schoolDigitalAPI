import { EntityRepository, Repository } from 'typeorm';
import { StudentEntity } from "./student.entity";

@EntityRepository(StudentEntity)
export class StudentRepository extends Repository<StudentEntity> {

}