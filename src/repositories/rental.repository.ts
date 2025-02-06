import Rental, { type IRental } from "../models/rental.model"

export class RentalRepository {
  async create(rentalData: Partial<IRental>): Promise<IRental | null> {
    const rental = new Rental(rentalData)
    await rental.save()
    return await Rental.findOne({ _id: rental._id }).populate("owner").populate("renter").populate({
        path: "car",
        populate: { path: "brand" }
    })
  }

  async findById(id: string): Promise<IRental | null> {
    return await Rental.findOne({ id }).populate("owner").populate("renter").populate({
        path: "car",
        populate: { path: "brand" }
    })
  }

  async findByRenter(renterId: string, page: number, limit: number): Promise<{ rentals: IRental[]; total: number }> {
    const skip = (page - 1) * limit
    const [rentals, total] = await Promise.all([
      Rental.find({ renter: renterId }).populate("owner").populate("renter").populate({
        path: "car",
        populate: { path: "brand" }
    }).skip(skip).limit(limit),
      Rental.countDocuments({ renter: renterId }),
    ])
    return { rentals, total }
  }

  async findByCar(carId: string, page: number, limit: number): Promise<{ rentals: IRental[]; total: number }> {
    const skip = (page - 1) * limit
    const [rentals, total] = await Promise.all([
      Rental.find({ car: carId }).populate("owner").populate("renter").populate({
        path: "car",
        populate: { path: "brand" }
    }).skip(skip).limit(limit),
      Rental.countDocuments({ car: carId }),
    ])
    return { rentals, total }
  }

  async update(id: string, rentalData: Partial<IRental>): Promise<IRental | null> {
    return await Rental.findOneAndUpdate({ id }, rentalData, { new: true }).populate("owner").populate("renter").populate({
        path: "car",
        populate: { path: "brand" }
    })
  }

  async delete(id: string): Promise<boolean> {
    const result = await Rental.deleteOne({ id })
    return result.deletedCount === 1
  }
}

