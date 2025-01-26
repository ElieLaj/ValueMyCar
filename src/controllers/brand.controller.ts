import type { NextFunction, Request, Response } from "express"
import { BrandService } from "../services/brand.service"

export class BrandController {
  private brandService: BrandService

  constructor() {
    this.brandService = new BrandService()
  }

  async createBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const brand = await this.brandService.createBrand(req.body)
      res.status(201).json(brand)
    } catch (error) {
        next(error)
    }
  }


  async getBrands(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10
      const result = await this.brandService.getBrands(page, limit)
      res.json(result)
    } catch (error) {
        next(error)
    }
  }
}

