import Car, { type ICar } from "../models/car.model"

export class CarRepository {
  async create(carData: Partial<ICar>): Promise<ICar> {
    const car = new Car(carData)
    return await car.save()
  }

  async findById(id: string): Promise<ICar | null> {
    return await Car.findOne({ id })
  }

  async findAll(page: number, limit: number): Promise<{ cars: ICar[]; total: number }> {
    const skip = (page - 1) * limit
    const [cars, total] = await Promise.all([Car.find().skip(skip).limit(limit), Car.countDocuments()])
    return { cars, total }
  }

  async update(id: string, carData: Partial<ICar>): Promise<ICar | null> {
    return await Car.findOneAndUpdate({ id }, carData, { new: true })
  }

  async delete(id: string): Promise<boolean> {
    const result = await Car.deleteOne({ id })
    return result.deletedCount === 1
  }
}

