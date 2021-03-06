// Custom validation decorator for checking if email already is in the database

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { User } from '../../../entity/User';

@ValidatorConstraint({ async: true })
export class doesEmailExistConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ where: { email }}).then(user => {
      if (user) return false;
      return true;
    });
  }
}

export function doesEmailExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: doesEmailExistConstraint,
    });
  };
}