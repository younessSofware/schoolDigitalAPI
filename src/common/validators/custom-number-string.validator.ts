import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customNumberString', async: false })
export class CustomNumberStringConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments): boolean {
    return typeof value === 'number' && !isNaN(value); // Example validation: checks if the value is a number
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Author ID must be a number'; // Custom error message
  }
}
export function CustomNumberString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'customNumberString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CustomNumberStringConstraint,
    });
  };
}
