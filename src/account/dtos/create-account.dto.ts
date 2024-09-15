import {
  IsEmail,
  isEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AccountRole } from 'src/common/enum/account-role.enum';
import { StartsWithAlphabetical } from 'src/common/validators/start-alphab.validator';
import { AccountEntity } from '../account.entity';
import { UniqueOnDatabase } from 'src/common/validators/unique.validator';
import { Match } from 'src/common/validators/match.validator';

export class CreateAccountRequestDto {
  @MinLength(3, { message: 'fullname:minLength.3' })
  @IsNotEmpty({ message: 'fullname:isNotEmpty' })
  @StartsWithAlphabetical({ message: 'name:startByAlhpa' })
  fullname: string;

  @UniqueOnDatabase(AccountEntity, '', { message: 'email:uniqueRow' })
  @IsEmail({}, { message: 'email:isEmail' })
  @IsNotEmpty({ message: 'email:isNotEmpty' })
  email: string;

  @IsNotEmpty({ message: 'password:isNotEmpty' })
  @MinLength(8, { message: 'password:minLength.8' })
  password: string;

  @Match('password', {message: 'passwordConfirmation:password_not_match'})
  @IsNotEmpty({ message: 'passwordConfirmation:isNotEmpty' })
  passwordConfirmation: string;
}
