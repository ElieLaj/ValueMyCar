import { FilterQuery } from "mongoose";
import Car, { type ICar } from "../models/car.model"
import { CarToCreate, CarToModify, SearchCarCriteria } from "../types/carDtos";

export class CarRepository {
  async create(carData: CarToCreate): Promise<ICar> {
    const car = new Car(carData)
    return await car.save()
  }

  async findById(id: string): Promise<ICar | null> {
    return await Car.findOne({ id }).populate("brand").populate("owner")
  }

  async findOneBy(filters: FilterQuery<SearchCarCriteria>): Promise<ICar | null> {
    const query: FilterQuery<SearchCarCriteria> = {}
    if (filters.name) query.name = { $regex: filters.name, $options: "i" }
    if (filters.brand) query.brand = filters.brand
    if (filters.year) query.year = filters.year
    if (filters.price) query.price = filters.price

    return await Car.findOne(query).populate("brand").populate("owner")
  }

  async findAll(page: number, limit: number): Promise<{ cars: ICar[]; total: number }> {
    const skip = (page - 1) * limit
    const [cars, total] = await Promise.all([Car.find().populate("brand").populate("owner").skip(skip).limit(limit), Car.countDocuments()])
    return { cars, total }
  }

  async findBy(filters: Partial<SearchCarCriteria>, page: number, limit: number): Promise<{ cars: ICar[]; total: number }> {
    const skip = (page - 1) * limit

    const query: FilterQuery<SearchCarCriteria> = {}
    if (filters.name) query.name = { $regex: filters.name, $options: "i" }
    if (filters.brand) query.brand = filters.brand
    if (filters.year) query.year = filters.year
    if (filters.price) query.price = filters.price

    const [cars, total] = await Promise.all([Car.find(query).populate("brand").populate("owner").skip(skip).limit(limit), Car.countDocuments(query)])
    return { cars, total }
  }

  async update(id: string, carData: Partial<ICar>): Promise<ICar | null> {
    return await Car.findOneAndUpdate({ id }, carData, { new: true }).populate("brand").populate("owner")
  }

  async delete(id: string): Promise<boolean> {
    const result = await Car.deleteOne({ id })
    return result.deletedCount === 1
  }
}

