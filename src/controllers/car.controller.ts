import type { Request, Response, NextFunction } from "express"
import { CarService } from "../services/car.service"
import { plainToClass, plainToInstance } from "class-transformer"
import { AdminCarPresenter, BrandCarPresenter, CarPresenter, CarToCreate, CarToModify, SearchCarCriteria } from "../types/carDtos"
import { validate } from "class-validator"
import { AppError } from "../utils/AppError"
import { EncodedRequest } from "../types/EncodedRequest"
import { UserRole } from "../models/user.model"

export class CarController {
  private carService: CarService

  constructor() {
    this.carService = new CarService()
  }

  async createCar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const carData = plainToClass(CarToCreate, req.body)

      const dtoErrors = await validate(carData);

      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));

        throw new AppError("Validation failed", 400, errors);
      }

      const car = await this.carService.createCar(carData)

      const carPresenter = plainToClass(BrandCarPresenter, car, { excludeExtraneousValues: true })

      res.status(201).json(carPresenter)
    } catch (error) {
      next(error)
    }
  }

  async getCar(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const car = await this.carService.getCar(req.params.id)
      const carPresenter = plainToClass(CarPresenter, car, { excludeExtraneousValues: true })
      res.status(200).json(carPresenter)
    } catch (error) {
      next(error)
    }
  }

  async getCars(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchCriteria = plainToClass(SearchCarCriteria, req.query)

      const dtoErrors = await validate(searchCriteria);

      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));

        throw new AppError("Validation failed", 400, errors);
      }

      const result = await this.carService.getCars(searchCriteria)

      const carPresenters = req.decoded.user.role === UserRole.USER ? 
        plainToInstance(CarPresenter, result.cars, { excludeExtraneousValues: true }) :
        plainToInstance(AdminCarPresenter, result.cars, { excludeExtraneousValues: true })

      res.status(200).json(carPresenters)
    } catch (error) {
      next(error)
    }
  }

  async updateCar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const carData = plainToClass(CarToModify, req.body)

      const dtoErrors = await validate(carData);

      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));

        throw new AppError("Validation failed", 400, errors);
      }

      const car = await this.carService.updateCar(req.params.id, carData)

      const carPresenter = plainToClass(CarPresenter, car, { excludeExtraneousValues: true })
      res.status(200).json(carPresenter)
    } catch (error) {
      next(error)
    }
  }

  async deleteCar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.carService.deleteCar(req.params.id)
      res.status(200).json({ message: "Car deleted" })
    } catch (error) {
      next(error)
    }
  }

  async patchCar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const carData = plainToClass(CarToModify, req.body)

      const dtoErrors = await validate(carData);

      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }));

        throw new AppError("Validation failed", 400, errors);
      }

      const car = await this.carService.patchCar(req.params.id, req.body)

      const carPresenter = plainToClass(CarPresenter, car, { excludeExtraneousValues: true })

      res.status(200).json(carPresenter)
    } catch (error) {
      next(error)
    }
  }
}

