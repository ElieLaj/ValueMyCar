import { RentalRepository } from "../repositories/rental.repository"
import { CarRepository } from "../repositories/car.repository"
import { UserRepository } from "../repositories/user.repository"
import type { RentalToCreate, RentalToModify } from "../types/rentalDtos"
import type { IRental } from "../models/rental.model"
import { AppError } from "../utils/AppError"
import { UserRole } from "../models/user.model"

export class RentalService {
  private rentalRepository: RentalRepository
  private carRepository: CarRepository
  private userRepository: UserRepository

  constructor() {
    this.rentalRepository = new RentalRepository()
    this.carRepository = new CarRepository()
    this.userRepository = new UserRepository()
  }

  async createRental(rentalData: RentalToCreate, userId: string): Promise<IRental> {
    const car = await this.carRepository.findById(rentalData.carId)
    if (!car) {
      throw new AppError("Car not found", 404)
    }

    if (car.renter) {
      throw new AppError("This car is not available for rent", 400)
    }

    const renter = await this.userRepository.findOneBy({id: userId})
    if (!renter) {
      throw new AppError("Renter not found", 404)
    }

    if (renter.id === car.owner.id) {
      throw new AppError("You cannot rent your own car", 400)
    }

    const startDate = new Date(rentalData.startDate)
    const endDate = new Date(rentalData.endDate)

    if (startDate >= endDate) {
      throw new AppError("End date must be after start date", 400)
    }

    const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    const totalPrice = durationInDays * car.price

    const rental = await this.rentalRepository.create({
      car: car._id,
      renter: renter._id,
      owner: car.owner._id,
      startDate,
      endDate,
      totalPrice,
      status: "pending",
    })

    if (!rental) {
      throw new AppError("Rental creation failed", 500)
    }

    car.renter = renter._id
    await car.save()

    renter.rents.push(rental._id)
    await renter.save()

    car.owner.rents.push(rental._id)
    await car.owner.save()

    return rental
  }

  async getRental(id: string, userId: string, userRole: UserRole): Promise<IRental> {
    const rental = await this.rentalRepository.findById(id)
    if (!rental) {
      throw new AppError("Rental not found", 404)
    }

    if (rental.renter._id !== userId && userRole !== UserRole.ADMIN && userRole !== UserRole.SUPERADMIN) {
      throw new AppError("You do not have permission to view this rental", 403)
    }

    return rental
  }

  async updateRentalStatus(
    id: string,
    rentalData: RentalToModify,
    userId: string,
    userRole: UserRole,
  ): Promise<IRental> {
    const rental = await this.rentalRepository.findById(id)
    if (!rental) {
      throw new AppError("Rental not found", 404)
    }

    const user = await this.userRepository.findOneBy({id: userId})
    if (!user) {
      throw new AppError("User not found", 404)
    }

    if(userRole === UserRole.USER && (user.id !== rental.renter.id && user.id !== rental.owner.id)) {
      throw new AppError("You do not have permission to update this rental", 403)
    }

    const car = await this.carRepository.findById(rental.car._id)
    if (!car) {
      throw new AppError("Car not found", 404)
    }

    if (rentalData.status) {
      if (user.id === rental.renter.id) {
        if((rentalData.status !== "cancelled")) {
          throw new AppError("You do not have permission to update this rental", 403)
        }
        if(rental.status === "active" || rental.status === "completed") {
          throw new AppError("This rental is already active or completed you cannot cancel it", 400)
        }
      }
      else if(user.id === rental.owner.id && (rental.status === "cancelled" || rental.status === "completed")) {
        throw new AppError("This rental is already cancelled or completed", 400)
      }
      if(rentalData.status === "completed" || rentalData.status === "cancelled") {
        car.renter = null
        await car.save()
      }
    }

    if (rentalData.totalPrice && rental.status !== "pending") {
      throw new AppError("You cannot update the total price of a rental when it isn't pending", 400)
    }


    rental.status = rentalData.status
    return await rental.save()
  }

  async deleteRental(id: string, userId: string, userRole: UserRole): Promise<void> {
    const rental = await this.rentalRepository.findById(id)
    if (!rental) {
      throw new AppError("Rental not found", 404)
    }

    if (rental.renter._id !== userId && rental.owner._id !== userId && userRole !== UserRole.ADMIN && userRole !== UserRole.SUPERADMIN) {
      throw new AppError("You do not have permission to delete this rental", 403)
    }

    const car = await this.carRepository.findById(rental.car.id)
    if (!car) {
      throw new AppError("Car not found", 404)
    }

    car.renter = null
    await car.save()

    await this.rentalRepository.delete(id)
  }

  async getUserRentals(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ rentals: IRental[]; total: number; pages: number }> {
    const user = await this.userRepository.findOneBy({id: userId})

    if (!user) {
      throw new AppError("User not found", 404)
    }

    const { rentals, total } = await this.rentalRepository.findByRenter(user._id, page, limit)
    const pages = Math.ceil(total / limit)
    console.log(rentals)
    return { rentals, total, pages }
  }

  async getCarRentals(
    carId: string,
    userId: string,
    userRole: UserRole,
    page = 1,
    limit = 10,
  ): Promise<{ rentals: IRental[]; total: number; pages: number }> {
    const car = await this.carRepository.findById(carId)
    if (!car) {
      throw new AppError("Car not found", 404)
    }

    if (car.owner._id !== userId && userRole !== UserRole.ADMIN && userRole !== UserRole.SUPERADMIN) {
      throw new AppError("You do not have permission to view these rentals", 403)
    }

    const { rentals, total } = await this.rentalRepository.findByCar(carId, page, limit)
    const pages = Math.ceil(total / limit)
    return { rentals, total, pages }
  }
}

