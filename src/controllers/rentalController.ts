import type { Request, Response, NextFunction } from "express"
import { RentalService } from "../services/rental.service"
import { RentalToCreate, RentalToModify, RentalPresenter } from "../types/rentalDtos"
import { plainToClass, plainToInstance } from "class-transformer"
import type { UserRole } from "../models/user.model"
import { EncodedRequest } from "../types/EncodedRequest"
import { validate } from "class-validator"
import { AppError } from "../utils/AppError"

export class RentalController {
  private rentalService: RentalService

  constructor() {
    this.rentalService = new RentalService()
  }

  async createRental(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const rentalData = plainToClass(RentalToCreate, req.body)

      const dtoErrors = await validate(rentalData)
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }))
        throw new AppError("Validation failed", 400, errors)
      }

      const rental = await this.rentalService.createRental(rentalData, req.decoded.user!.id)
      const rentalPresenter = plainToClass(RentalPresenter, rental, { excludeExtraneousValues: true })
      res.status(201).json(rentalPresenter)
    } catch (error) {
      next(error)
    }
  }

  async getRental(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const rental = await this.rentalService.getRental(req.params.id, req.decoded.user!.id, req.decoded.user!.role as UserRole)
      const rentalPresenter = plainToClass(RentalPresenter, rental, { excludeExtraneousValues: true })
      res.status(200).json(rentalPresenter)
    } catch (error) {
      next(error)
    }
  }

  async updateRentalStatus(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const rentalData = plainToClass(RentalToModify, req.body)

      const dtoErrors = await validate(rentalData)
      if (dtoErrors.length > 0) {
        const errors = dtoErrors.map(error => ({
          field: error.property,
          constraints: error.constraints ? Object.values(error.constraints) : []
        }))
        throw new AppError("Validation failed", 400, errors)
      }

      const rental = await this.rentalService.updateRentalStatus(
        req.params.id,
        rentalData,
        req.decoded.user!.id,
        req.decoded.user!.role as UserRole,
      )
      const rentalPresenter = plainToClass(RentalPresenter, rental, { excludeExtraneousValues: true })
      res.status(200).json(rentalPresenter)
    } catch (error) {
      next(error)
    }
  }

  async getUserRentals(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10
      const result = await this.rentalService.getUserRentals(req.decoded.user!.id, page, limit)
      const rentalPresenters = plainToInstance(RentalPresenter, result.rentals, { excludeExtraneousValues: true })
      res.status(200).json(rentalPresenters)
    } catch (error) {
      next(error)
    }
  }

  async getCarRentals(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10
      const result = await this.rentalService.getCarRentals(
        req.params.carId,
        req.decoded.user!.id,
        req.decoded.user!.role as UserRole,
        page,
        limit,
      )
      const rentalPresenters = plainToInstance(RentalPresenter, result.rentals, { excludeExtraneousValues: true })
      res.status(200).json(rentalPresenters)
    } catch (error) {
      next(error)
    }
  }

  async deleteRental(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.rentalService.deleteRental(req.params.id, req.decoded.user!.id, req.decoded.user!.role as UserRole)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}

