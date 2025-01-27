import type { Request, Response, NextFunction } from "express"
import { CarService } from "../services/car.service"

export class CarController {
  private carService: CarService

  constructor() {
    this.carService = new CarService()
  }

  async createCar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const car = await this.carService.createCar(req.body)
      res.status(201).json(car)
    } catch (error) {
      next(error)
    }
  }

  async getCar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const car = await this.carService.getCar(req.params.id)
      res.status(200).json(car)
    } catch (error) {
      next(error)
    }
  }

  async getCars(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10
      const result = await this.carService.getCars(page, limit)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  async updateCar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const car = await this.carService.updateCar(req.params.id, req.body)
      res.status(200).json(car)
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
      const car = await this.carService.patchCar(req.params.id, req.body)
      res.status(200).json(car)
    } catch (error) {
      next(error)
    }
  }
}

