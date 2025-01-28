import type { NextFunction, Request, Response } from "express"
import { BrandService } from "../services/brand.service"
import { BrandPresenter, BrandToCreate, BrandToModify, BrandToReplace, SearchBrandCriteria } from "../types/brandDtos";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";
import { BrandCarPresenter, CarPresenter } from "../types/carDtos";

export class BrandController {
  private brandService: BrandService

  constructor() {
    this.brandService = new BrandService()
  }

  async createBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brandData = plainToClass(BrandToCreate, req.body)

      const dtoErrors = await validate(brandData);
      
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));

        throw new AppError("Validation failed", 400, errors);
      }

      const brand = await this.brandService.createBrand(brandData)
      const brandPresenter = plainToClass(BrandPresenter, brand, { excludeExtraneousValues: true })
      
      res.status(201).json(brandPresenter)
    } catch (error) {
        next(error)
    }
  }

  async getBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchCriteria = plainToClass(SearchBrandCriteria, req.query)

      const dtoErrors = await validate(searchCriteria);
      
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));

        throw new AppError("Validation failed", 400, errors);
      }

      const result = await this.brandService.getBrands(searchCriteria)

      const brandPresenters = plainToInstance(BrandPresenter, result.brands, { excludeExtraneousValues: true })

      res.json(brandPresenters)
    } catch (error) {
        next(error)
    }
  }

  async getBrandCars(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cars = await this.brandService.getBrandCars(req.params.id)

      const carPresenters = plainToInstance(BrandCarPresenter, cars, { excludeExtraneousValues: true })
      
      res.status(200).json(carPresenters)
    } catch (error) {
      next(error)
    }
  }

  async updateBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brandData = plainToClass(BrandToReplace, req.body)

      const dtoErrors = await validate(brandData);
      
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));

        throw new AppError("Validation failed", 400, errors);
      }

      const brand = await this.brandService.updateBrand(req.params.id, brandData)
      const brandPresenter = plainToClass(BrandPresenter, brand, { excludeExtraneousValues: true })
      
      res.status(200).json(brandPresenter)
    } catch (error) {
      next(error)
    }
  }

  async patchBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brandData = plainToClass(BrandToModify, req.body)

      const dtoErrors = await validate(brandData);
      
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));

        throw new AppError("Validation failed", 400, errors);
      }

      const brand = await this.brandService.patchBrand(req.params.id, brandData)
      const brandPresenter = plainToClass(BrandPresenter, brand, { excludeExtraneousValues: true })


      res.status(200).json(brandPresenter)
    } catch (error) {
      next(error)
    }
  }

  async deleteBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.brandService.deleteBrand(req.params.id)
      res.status(204).json({ message: "Brand deleted" })
    } catch (error) {
      next(error)
    }
  }
}

