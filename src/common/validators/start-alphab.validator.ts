import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'startsWithAlphabetical', async: false })
export class StartsWithAlphabeticalConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    return /^[a-zA-Z]/.test(value); // Checks if the string starts with an alphabetical character
  }

  defaultMessage(args: ValidationArguments): string {
    return 'The value must start with an alphabetical character'; // Custom error message
  }
}

export function StartsWithAlphabetical(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'startsWithAlphabetical',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: StartsWithAlphabeticalConstraint,
    });
  };
}
