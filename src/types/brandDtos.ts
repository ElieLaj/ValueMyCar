import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { CarPresenter } from './carDtos';
import "reflect-metadata"

export class BrandToCreate {
  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose()
  country!: string;
}

export class BrandToModify {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;
  
  @IsString()
  @IsOptional()
  @Expose()
  country?: string;
}

export class SearchBrandCriteria {
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @IsString()
  @IsOptional()
  @Expose()
  country?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Expose()
  page: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Expose()
  limit: number = 10;
}

export class BrandToReplace extends BrandToCreate {}

export class BrandPresenter {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  country!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CarPresenter)
  @Expose()
  cars?: CarPresenter[];
}

export class CarBrandPresenter {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  country!: string;
}
