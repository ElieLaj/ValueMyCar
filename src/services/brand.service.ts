import { BrandRepository } from "../repositories/brand.repository"
import type { IBrand } from "../models/brand.model"

export class BrandService {
  private brandRepository: BrandRepository

  constructor() {
    this.brandRepository = new BrandRepository()
  }

  async createBrand(brandData: Partial<IBrand>): Promise<IBrand> {
    if (!brandData.name) {
      throw new Error("Name is required")
    }
    if (!brandData.country) {
      throw new Error("Country is required")
    }
    const brand = await this.brandRepository.findBy({ name: brandData.name})

    if (brand) {
      throw new Error("Brand already exists")
    }

    return await this.brandRepository.create(brandData)
  }

  async getBrands(page: number, limit: number): Promise<{ brands: IBrand[]; total: number; pages: number }> {
    const { brands, total } = await this.brandRepository.findAll(page, limit)
    const pages = Math.ceil(total / limit)
    return { brands, total, pages }
  }

}

