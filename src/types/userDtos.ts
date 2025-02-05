import { IsString, IsEmail, MinLength, IsOptional, IsEnum, IsArray, ValidateNested } from "class-validator"
import { Expose, Type } from "class-transformer"
import { UserRole } from "../models/user.model"
import { CarPresenter, UserCarPresenter } from "./carDtos"

export class UserToCreate {
  @IsEmail()
  @Expose()
  email!: string

  @IsString()
  @MinLength(8)
  @Expose()
  password!: string

  @IsEnum(UserRole)
  @IsOptional()
  @Expose()
  role: UserRole = UserRole.USER
}

export class UserToLogin {
  @IsEmail()
  @Expose()
  email!: string

  @IsString()
  @Expose()
  password!: string
}

export class UserToModify {
  @IsEmail()
  @IsOptional()
  @Expose()
  email?: string

  @IsString()
  @IsOptional()
  @Expose()
  password?: string

  @IsEnum(UserRole)
  @IsOptional()
  @Expose()
  role?: UserRole
}


export class SearchUserCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  id?: string

  @IsEmail()
  @IsOptional()
  @Expose()
  email?: string
}

export class UserPresenter {
  @Expose()
  email!: string
}

export class AdminUserPresenter extends UserPresenter {
  @Expose()
  id!: string

  @Expose()
  role!: UserRole
  
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarPresenter)
  @Expose()
  cars!: CarPresenter[]
}

