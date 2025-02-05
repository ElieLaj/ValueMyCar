import type { Request, Response, NextFunction } from "express"
import { RentalService } from "../services/rental.service"
import { RentalToCreate, RentalToModify, RentalPresenter } from "../types/rentalDtos"
import { plainToClass, plainToInstance } from "class-transformer"
import type { UserRole } from "../models/user.model"
import { EncodedRequest } from "../types/EncodedRequest"

export class RentalController {
  private rentalService: RentalService

  constructor() {
    this.rentalService = new RentalService()
  }

  async createRental(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const rentalData = plainToClass(RentalToCreate, req.body)
      const rental = await this.rentalService.createRental(rentalData, req.decoded.user!.id)
      const rentalPresenter = plainToClass(RentalPresenter, rental, { excludeExtraneousValues: true })
      res.status(201).json({
        status: "success",
        data: { rental: rentalPresenter },
      })
    } catch (error) {
      next(error)
    }
  }

  async getRental(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const rental = await this.rentalService.getRental(req.params.id, req.decoded.user!.id, req.decoded.user!.role as UserRole)
      const rentalPresenter = plainToClass(RentalPresenter, rental, { excludeExtraneousValues: true })
      res.status(200).json({
        status: "success",
        data: { rental: rentalPresenter },
      })
    } catch (error) {
      next(error)
    }
  }

  async updateRentalStatus(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const rentalData = plainToClass(RentalToModify, req.body)
      const rental = await this.rentalService.updateRentalStatus(
        req.params.id,
        rentalData,
        req.decoded.user!.id,
        req.decoded.user!.role as UserRole,
      )
      const rentalPresenter = plainToClass(RentalPresenter, rental, { excludeExtraneousValues: true })
      res.status(200).json({
        status: "success",
        data: { rental: rentalPresenter },
      })
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
      res.status(200).json({
        status: "success",
        data: { ...result, rentals: rentalPresenters },
      })
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
      res.status(200).json({
        status: "success",
        data: { ...result, rentals: rentalPresenters },
      })
    } catch (error) {
      next(error)
    }
  }
}

