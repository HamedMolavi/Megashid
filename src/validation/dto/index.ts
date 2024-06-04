import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator, ValidateIf } from 'class-validator';
import { RequestHandler, Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
// import { sanitize, Trim } from "class-sanitizer";
import { ApiError } from "../../types/classes/error.class";

export function dtoValidationMiddleware(type: any, options?: { skipMissingProperties?: boolean, detailedMassage?: boolean, info?: string }): RequestHandler {
  let defaultOpt = { skipMissingProperties: false, detailedMassage: process.env["NODE_ENV"]==="development" ? true : false, info: undefined };
  //@ts-ignore
  for (const key in options) defaultOpt[key] = options[key];
  return async (req: Request, _res: Response, next: NextFunction) => {
    await new Promise((resolve, _reject) => resolve(plainToInstance(type, req.body)))
      .then((dtoObj: any) => validate(dtoObj, { skipMissingProperties: defaultOpt["skipMissingProperties"] }))
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          const dtoErrorsString = defaultOpt["detailedMassage"]
            ? errors.map((error: ValidationError) => (Object as any).values(error.constraints)).join(", ")
            : "Bad request!"
          next(new ApiError(400, dtoErrorsString));
        } else {
          //TODO: sanitize the object and call the next middleware
          // sanitize(dtoObj);
          // req.body = dtoObj;
          next();
        };
      })
      .catch(err => next(new ApiError(400, err)))
  };
};

/*
{
    * Validating value.
  value: any;
    * Constraints set by this validation type.
  constraints: any[];
    * Name of the target that is being validated.
  targetName: string;
    * Object that is being validated.
  object: object;
    * Name of the object's property being validated.
  property: string;
}
*/
export function Or(thisName: string, propertyNames: string[], validationOptions?: ValidationOptions) {
  return ValidateIf((object: any, value: any) => {
    // Check if the value is undefined or null
    if (value !== undefined && value !== null) {
      return true; // If the value is not undefined or null, proceed with validation
    }
    // If the value is undefined or null, check if any of the other properties are defined
    if(propertyNames.some((name)=>!!object[name])){
      return false; // pass this one
    }
    // If the value is undefined or null and none of the other properties are defined, the validation fails
    throw new Error(`One of these must be defiend: ${[thisName].concat(propertyNames).join(" - ")}!`)
  }, validationOptions);
 }
