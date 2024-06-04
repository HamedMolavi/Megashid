import { IsEmail, IsString, IsDefined, MinLength, IsBoolean, IsOptional, NotContains } from "class-validator";
import mongoose, { Schema } from "mongoose";


export class CreateConnectionBody {
  @IsOptional()
  @IsString()
  public name?: string;
  @IsString()
  public password?: string;
};

export class UpdateConnectionBody {
  @IsOptional()
  @IsString()
  public name?: string;
  @IsOptional()
  @IsString()
  public new_password?: string;
  @IsString()
  @IsOptional()
  public password?: string;
};