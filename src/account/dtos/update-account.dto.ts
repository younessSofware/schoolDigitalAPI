import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { StartsWithAlphabetical } from 'src/common/validators/start-alphab.validator';
import { UniqueOnDatabase } from 'src/common/validators/unique.validator';
import { AccountEntity } from '../account.entity';

export class UpdateAccountRequestDto {
  @IsOptional()
  @MinLength(3, { message: 'fullname:minLength.3' })
  @StartsWithAlphabetical({ message: 'name:startByAlpha' })
  fullname: string;
  
  @IsOptional()
  @UniqueOnDatabase(AccountEntity, 'email', { message: 'email:uniqueRow' })
  @IsEmail({}, { message: 'email:isEmail' })
  email: string;
}
