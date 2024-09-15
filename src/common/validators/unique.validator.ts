import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Not } from 'typeorm';
import { Helper } from '../helpers';

@ValidatorConstraint({ async: true })
export class UniqueOnDatabaseExistConstraint
  implements ValidatorConstraintInterface
{
  updateExceptionField: string;
  private validationOptions: ValidationOptions;
  constructor(updateExceptionField: string, validationOptions: ValidationOptions) {
    this.updateExceptionField = updateExceptionField;
    this.validationOptions = validationOptions;
  }

  async validate(value: any, args: ValidationArguments) {
    const entity = args.object[`class_entity_${args.property}`];  
    const filter = {
      [args.property]: value,
      // ...(this.updateExceptionField
      //   ? {
      //       [this.updateExceptionField]: Not(
      //         args.object[this.updateExceptionField],
      //       ),
      //     }
      //   : {}),
    };

    try {
    return await Helper.isEntityUnique(entity, filter)
      
    } catch (error) {
      
      
      return false
    }

  }
}

export function UniqueOnDatabase(
  entity: any,
  updateExceptionField?: string,
  validationOptions?: ValidationOptions,
) {
  validationOptions = { ...{ message: 'uniqueRow' }, ...validationOptions };

  return function (object: any, propertyName: string) {
    object[`class_entity_${propertyName}`] = entity;

    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: new UniqueOnDatabaseExistConstraint(updateExceptionField, validationOptions),
    });
  };
}
