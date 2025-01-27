import { CarRepository } from "../repositories/car.repository"
import type { ICar } from "../models/car.model"
import { AppError } from "../utils/AppError"


export class CarService {
  private carRepository: CarRepository

  constructor() {
    this.carRepository = new CarRepository()
  }

  async createCar(carData: Partial<ICar>): Promise<ICar> {
    if (!carData.name || !carData.brandId || !carData.year || !carData.price) {
      throw new AppError("Missing required fields", 400)
    }
    return await this.carRepository.create(carData)
  }

  async getCar(id: string): Promise<ICar> {
    const car = await this.carRepository.findById(id)
    if (!car) {
      throw new AppError("Car not found", 404)
    }
    return car
  }

  async getCars(criteria: Partial<ICar>, page: number, limit: number): Promise<{ cars: ICar[]; total: number; pages: number }> {
    const { cars, total } = await this.carRepository.findBy(criteria, page, limit)
    const pages = Math.ceil(total / limit)
    return { cars, total, pages }
  }

  async updateCar(id: string, carData: Partial<ICar>): Promise<ICar> {
    const updatedCar = await this.carRepository.update(id, carData)
    if (!updatedCar) {
      throw new AppError("Car not found", 404)
    }
    return updatedCar
  }

  async deleteCar(id: string): Promise<void> {
    const result = await this.carRepository.delete(id)
    if (!result) {
      throw new AppError("Car not found", 404)
    }
  }

  async patchCar(id: string, carData: Partial<ICar>): Promise<ICar> {
    const car = await this.carRepository.findById(id)
    if (!car) {
      throw new AppError("Car not found", 404)
    }
    const updatedCar = await this.carRepository.update(id, carData)
    if (!updatedCar) {
      throw new AppError("Car not found", 404)
    }
    return updatedCar
  }
}

