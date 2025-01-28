import { IsString, IsEmail, MinLength, IsOptional } from "class-validator"
import { Expose } from "class-transformer"

export class UserToCreate {
  @IsEmail()
  @Expose()
  email!: string

  @IsString()
  @MinLength(8)
  @Expose()
  password!: string
}

export class UserToLogin {
  @IsEmail()
  @Expose()
  email!: string

  @IsString()
  @Expose()
  password!: string
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

