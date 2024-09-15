import { IsBoolean, isBoolean, IsNotEmpty, IsNumber, MinLength } from "class-validator";
import { StartsWithAlphabetical } from "src/common/validators/start-alphab.validator";

export class CreateClassRequestDto {
    @MinLength(3, { message: 'name:minLength.3' })
    @IsNotEmpty({ message: 'name:isNotEmpty' })
    @StartsWithAlphabetical({ message: 'name:startByAlhpa' })
    name: string;
  
    @IsNotEmpty({ message: 'study_material:isNotEmpty' })
    @StartsWithAlphabetical({ message: 'study_material:startByAlhpa' })
    study_material: string;

    @IsNotEmpty({ message: 'academic_year:isNotEmpty' })
    academic_year: string;

    @IsBoolean({ message: 'is_academic:booleanValue' })
    is_academic: boolean;

    @IsNumber({}, { message: 'nbr_max_student:isNumber' })
    nbr_max_student: number;

    @IsNumber({}, { message: 'monthly_fee:isNumber' })
    monthly_fee: number;

    @IsNumber({}, { message: 'teacher_id:isNumber' })
    teacher_id: number;

  }