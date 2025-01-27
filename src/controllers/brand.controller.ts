import type { NextFunction, Request, Response } from "express"
import { BrandService } from "../services/brand.service"
import { BrandPresenter, BrandToCreate, BrandToModify, BrandToReplace, SearchBrandCriteria } from "../types/brandDtos";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppError } from "../utils/AppError";
import { CarPresenter } from "../types/carDtos";

export class BrandController {
  private brandService: BrandService
  private page: number = 1;
  private limit: number = 10;

  constructor() {
    this.brandService = new BrandService()
  }

  async createBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brandData = plainToClass(BrandToCreate, req.body)

      const dtoErrors = await validate(brandData);
      
      if (dtoErrors.length > 0) {
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
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
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
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

      const carPresenters = plainToInstance(CarPresenter, cars, { excludeExtraneousValues: true })
      
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
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
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
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
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

