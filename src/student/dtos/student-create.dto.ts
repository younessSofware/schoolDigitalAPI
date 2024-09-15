import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentRequestDto {
  @IsString({ message: 'fullname:IsString' })
  fullname: string;

  @IsString({ message: 'phone_number:IsString' })
  phone_number: string;

  @IsString({ message: 'adresse:IsString' })
  adresse: string;

  @IsNotEmpty({ message: 'class_ids:IsString' })
  class_ids: number[];
}
