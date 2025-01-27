import { IsString, IsNumber, IsUUID, Min, Max, IsOptional, ValidateNested } from "class-validator"
import { Expose, Transform, Type } from "class-transformer"
import { BrandPresenter, CarBrandPresenter } from "./brandDtos"
import "reflect-metadata"

export class CarToCreate {
  @IsString()
  @Expose()
  name!: string

  @IsUUID()
  @Expose()
  brand!: string

  @IsNumber()
  @Max(new Date().getFullYear() + 1)
  @Expose()
  year!: number

  @IsNumber()
  @Min(0)
  @Expose()
  price!: number
}

export class CarToModify {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string

  @IsUUID()
  @IsOptional()
  @Expose()
  brand?: string

  @IsNumber()
  @Max(new Date().getFullYear() + 1)
  @IsOptional()
  @Expose()
  year?: number

  @IsNumber()
  @Min(0)
  @IsOptional()
  @Expose()
  price?: number
}

export class SearchCarCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string

  @IsUUID()
  @IsOptional()
  @Expose()
  brand?: string

  @IsNumber()
  @IsOptional()
  @Max(new Date().getFullYear() + 1)
  @Expose()
  year?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Expose()
  price?: number

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Expose()
  page: number = 1

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Expose()
  limit: number = 10
}

export class CarToReplace extends CarToCreate {}

export class CarPresenter {
  @Expose()
  id!: string

  @Expose()
  name!: string

  @Type(() => CarBrandPresenter)
  @Expose()
  brand!: CarBrandPresenter

  @Expose()
  year!: number

  @Expose()
  price!: number
}

export class BrandCarPresenter {
  @Expose()
  id!: string

  @Expose()
  name!: string

  @Expose()
  brand!: BrandPresenter

  @Expose()
  year!: number

  @Expose()
  price!: number
}
