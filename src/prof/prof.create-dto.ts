import { Type } from 'class-transformer';
import {
  IsAlpha,
  IsInt,
  IsNotEmpty,
  IsNumber,
  isNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateAccountRequestDto } from 'src/account/dtos/create-account.dto';

export class ProfCreateDto {
  @IsString({ message: 'fullname:IsString' })
  fullname: string;

  @IsString({ message: 'phone_number:IsString' })
  phone_number: string;

  @IsString({ message: 'adresse:IsString' })
  adresse: string;

  @IsNumber({}, { message: 'teacher_share_percentage:isNumber' })
  teacher_share_percentage: number;

}
