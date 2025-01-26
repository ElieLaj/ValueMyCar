import { BrandRepository } from "../repositories/brand.repository"
import type { IBrand } from "../models/brand.model"
import { AppError } from "../utils/AppError"

export class BrandService {
  private brandRepository: BrandRepository

  constructor() {
    this.brandRepository = new BrandRepository()
  }

  async createBrand(brandData: Partial<IBrand>): Promise<IBrand> {
    if (!brandData.name) {
      throw new AppError("Name is required", 400)
    }
    if (!brandData.country) {
      throw new AppError("Country is required", 400)
    }
    const brand = await this.brandRepository.findBy({ name: brandData.name})

    if (brand) {
      throw new AppError("Brand already exists", 400)
    }

    return await this.brandRepository.create(brandData)
  }

  async getBrands(page: number, limit: number): Promise<{ brands: IBrand[]; total: number; pages: number }> {
    const { brands, total } = await this.brandRepository.findAll(page, limit)
    const pages = Math.ceil(total / limit)
    return { brands, total, pages }
  }

}

