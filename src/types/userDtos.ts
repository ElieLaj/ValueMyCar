import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from "class-validator"
import { Expose } from "class-transformer"
import { UserRole } from "../models/user.model"

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
  id!: string

  @Expose()
  email!: string
}

