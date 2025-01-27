import type { Request, Response, NextFunction } from "express"
import { CarService } from "../services/car.service"
import { plainToClass, plainToInstance } from "class-transformer"
import { CarPresenter, CarToCreate, CarToModify, SearchCarCriteria } from "../types/carDtos"
import { validate } from "class-validator"
import { AppError } from "../utils/AppError"

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
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
      }

      const car = await this.carService.createCar(carData)

      const carPresenter = plainToClass(CarPresenter, car, { excludeExtraneousValues: true })

      res.status(201).json(carPresenter)
    } catch (error) {
      next(error)
    }
  }

  async getCar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const car = await this.carService.getCar(req.params.id)
      const carPresenter = plainToClass(CarPresenter, car, { excludeExtraneousValues: true })
      res.status(200).json(carPresenter)
    } catch (error) {
      next(error)
    }
  }

  async getCars(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const searchCriteria = plainToClass(SearchCarCriteria, req.query)

      console.log(searchCriteria)

      const dtoErrors = await validate(searchCriteria);

      if (dtoErrors.length > 0) {
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
      }

      const result = await this.carService.getCars(searchCriteria)

      const carPresenters = plainToInstance(CarPresenter, result.cars, { excludeExtraneousValues: true })

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
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
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
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
      }

      const car = await this.carService.patchCar(req.params.id, req.body)
      res.status(200).json(car)
    } catch (error) {
      next(error)
    }
  }
}

