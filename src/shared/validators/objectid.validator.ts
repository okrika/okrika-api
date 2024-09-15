import { registerDecorator, ValidationOptions } from "class-validator";
import { Types } from "mongoose";

export interface ObjectIdValidationOptions extends ValidationOptions {
  field?: string;
}

export function IsObjectId(
  validationOptions?: ObjectIdValidationOptions
): PropertyDecorator {
  return (target: object, propertyName: string) => {
    registerDecorator({
      propertyName,
      name: "IsObjectId",
      target: target.constructor,
      options: validationOptions,
      validator: {
        validate: value => {
          return Types.ObjectId.isValid(value);
        },
        defaultMessage: validationArguments => {
          return `Please provide a valid ${
            validationOptions?.field || validationArguments.targetName
          } id.`;
        }
      }
    });
  };
}
