import { CarRepository } from "../repositories/car.repository"
import type { ICar } from "../models/car.model"
import { AppError } from "../utils/AppError"
import { BrandRepository } from "../repositories/brand.repository"
import { CarToCreate, CarToModify, SearchCarCriteria } from "../types/carDtos"


export class CarService {
  private carRepository: CarRepository
  private brandRepository: BrandRepository

  constructor() {
    this.carRepository = new CarRepository()
    this.brandRepository = new BrandRepository()
  }

  async createCar(carData: CarToCreate): Promise<ICar> {

    const brand = await this.brandRepository.findOneBy({id: carData.brand })
    if (!brand) {
      throw new AppError("Brand not found", 404)
    }

    carData.brand = brand._id

    const car = await this.carRepository.create(carData)

    brand.cars.push(car._id)
    await brand.save()

    return car
  }

  async getCar(id: string): Promise<ICar> {
    const car = await this.carRepository.findById(id)
    if (!car) {
      throw new AppError("Car not found", 404)
    }
    return car
  }

  async getCars(searchCriteria: SearchCarCriteria): Promise<{ cars: ICar[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = searchCriteria

    const { cars, total } = await this.carRepository.findBy(filters, page, limit)
    const pages = Math.ceil(total / limit)

    return { cars, total, pages }
  }

  async updateCar(id: string, carData: CarToModify): Promise<ICar> {
    const car = await this.carRepository.findById(id)
    if (!car) {
      throw new AppError("Car not found", 404)
    }
    
    const newBrand = await this.brandRepository.findOneBy({ id: carData.brand })

    if (!newBrand) {
      throw new AppError("Brand not found", 404)
    }

    if (car.brand.id !== carData.brand) {
      const oldBrand = await this.brandRepository.findOneBy({ id: car.brand.id })

      if (oldBrand) {
        oldBrand.cars = oldBrand.cars.filter((car) => car.id !== id)
        await oldBrand.save()
      }

      newBrand.cars.push(car._id)
      await newBrand.save()
    }

    const updatedCar = await this.carRepository.update(id, { ...carData, brand: newBrand._id })
    if (!updatedCar) {
      throw new AppError("Car not found", 404)
    }

    return updatedCar
  }

  async deleteCar(id: string): Promise<void> {
    const car = await this.carRepository.findById(id)
    if (!car) {
      throw new AppError("Car not found", 404)
    }

    const brand = await this.brandRepository.findOneBy({id: car.brand.id})
    if (brand) {
      brand.cars = brand.cars.filter((car) => car.id !== id)
      await brand.save()
    }

    const result = await this.carRepository.delete(id)
    if (!result) {
      throw new AppError("Failed to delete car", 500)
    }
  }

  async patchCar(id: string, carData: Partial<ICar>): Promise<ICar> {
    const car = await this.carRepository.findById(id)
    if (!car) {
      throw new AppError("Car not found", 404)
    }

    if (carData.brand && car.brand.id !== carData.brand) {
      const oldBrand = await this.brandRepository.findOneBy({ id: car.brand.id })
      const newBrand = await this.brandRepository.findOneBy({ id: carData.brand })

      if (!newBrand) {
        throw new AppError("New brand not found", 404)
      }

      if (oldBrand) {
        oldBrand.cars = oldBrand.cars.filter((car) => car.id !== id)
        await oldBrand.save()
      }

      carData.brand = newBrand._id

      newBrand.cars.push(car._id)
      await newBrand.save()
    }

    const updatedCar = await this.carRepository.update(id, carData)
    if (!updatedCar) {
      throw new AppError("Car not found", 404)
    }

    return updatedCar
  }
}

