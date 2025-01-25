import { CarRepository } from "../repositories/car.repository"
import type { ICar } from "../models/car.model"

export class CarService {
  private carRepository: CarRepository

  constructor() {
    this.carRepository = new CarRepository()
  }

  async createCar(carData: Partial<ICar>): Promise<ICar> {
    if (!carData.name || !carData.brandId || !carData.year || !carData.price) {
      throw new Error("Missing required fields")
    }
    return await this.carRepository.create(carData)
  }

  async getCar(id: string): Promise<ICar | null> {
    return await this.carRepository.findById(id)
  }

  async getCars(page: number, limit: number): Promise<{ cars: ICar[]; total: number; pages: number }> {
    const { cars, total } = await this.carRepository.findAll(page, limit)
    const pages = Math.ceil(total / limit)
    return { cars, total, pages }
  }

  async updateCar(id: string, carData: Partial<ICar>): Promise<ICar | null> {
    return await this.carRepository.update(id, carData)
  }

  async deleteCar(id: string): Promise<boolean> {
    return await this.carRepository.delete(id)
  }
}

