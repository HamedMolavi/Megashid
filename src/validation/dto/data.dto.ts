import { IsEmail, IsString, IsDefined, MinLength, IsBoolean, IsOptional, NotContains, IsNumber } from "class-validator";
import mongoose, { Schema } from "mongoose";


export class CreateDataBody {
  @IsNumber()
  public ts?: number;
  @IsString()
  public name?: string;
  @IsString()
  public value?: string;
};
