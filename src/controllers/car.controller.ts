import type { Request, Response } from "express"
import { CarService } from "../services/car.service"

export class CarController {
  private carService: CarService

  constructor() {
    this.carService = new CarService()
  }

  async createCar(req: Request, res: Response): Promise<void> {
    try {
      const car = await this.carService.createCar(req.body)
      res.status(201).json(car)
    } catch (error) {
      console.error("Error creating car:", error)
      res.status(500).json({
        message: "Error creating car",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  async getCar(req: Request, res: Response): Promise<void> {
    try {
      const car = await this.carService.getCar(req.params.id)
      if (car) {
        res.json(car)
      } else {
        res.status(404).json({ message: "Car not found" })
      }
    } catch (error) {
      console.error("Error retrieving car:", error)
      res.status(500).json({
        message: "Error retrieving car",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  async getCars(req: Request, res: Response): Promise<void> {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10
      const result = await this.carService.getCars(page, limit)
      res.json(result)
    } catch (error) {
      console.error("Error retrieving cars:", error)
      res.status(500).json({
        message: "Error retrieving cars",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  async updateCar(req: Request, res: Response): Promise<void> {
    try {
      const car = await this.carService.updateCar(req.params.id, req.body)
      if (car) {
        res.json(car)
      } else {
        res.status(404).json({ message: "Car not found" })
      }
    } catch (error) {
      console.error("Error updating car:", error)
      res.status(500).json({
        message: "Error updating car",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  async deleteCar(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.carService.deleteCar(req.params.id)
      if (result) {
        res.status(204).send()
      } else {
        res.status(404).json({ message: "Car not found" })
      }
    } catch (error) {
      console.error("Error deleting car:", error)
      res.status(500).json({
        message: "Error deleting car",
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }
}

