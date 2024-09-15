import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class NumberLengthConstraint implements ValidatorConstraintInterface {

  type: 'max' | 'min' | 'equal';
  length: number
  
  constructor(length: number, type: 'max' | 'min' | 'equal'){
    this.length = length;
    this.type = type
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(value: number, _args: ValidationArguments) {
    const valueLength = value.toString().length;
    if(this.type == 'max') return valueLength <= this.length
    if(this.type == 'min') return valueLength >= this.length
    if(this.type == 'equal') return valueLength == this.length
  }
}

export function MaxNumberLength(length: number, validationOptions?: ValidationOptions) {
  validationOptions = { ...{ message: 'maxNumberLength ' + length }, ...validationOptions };
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      name: 'maxNumberLength',
      validator: new NumberLengthConstraint(length, 'max'),
    });
  };
}

export function MinNumberLength(length: number, validationOptions?: ValidationOptions) {
  validationOptions = { ...{ message: 'minNumberLength ' + length }, ...validationOptions };
  
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      name: 'minNumberLength',
      validator: new NumberLengthConstraint(length, 'min'),
    });
  };
}

export function NumberLength(length: number, validationOptions?: ValidationOptions) {
  validationOptions = { ...{ message: 'numberLength ' + length }, ...validationOptions };
  
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      name: 'numberLength',
      validator: new NumberLengthConstraint(length, 'equal'),
    });
  };
}