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
    const brand = await this.brandRepository.findOneBy({ name: brandData.name})

    if (brand) {
      throw new AppError("Brand already exists", 400)
    }

    return await this.brandRepository.create(brandData)
  }

  async getBrands(criteria: Partial<IBrand>, page: number, limit: number): Promise<{ brands: IBrand[]; total: number; pages: number }> {
    const { brands, total } = await this.brandRepository.findBy(criteria, page, limit)
    const pages = Math.ceil(total / limit)
    return { brands, total, pages }
  }

  async getBrand(id: string): Promise<IBrand> {
    const brand = await this.brandRepository.findById(id)
    if (!brand) {
      throw new AppError("Brand not found", 404)
    }
    return brand
  }

  async updateBrand(id: string, brandData: Partial<IBrand>): Promise<IBrand> {
    if (!brandData.name) {
      throw new AppError("Name is required", 400)
    }

    if (!brandData.country) {
      throw new AppError("Country is required", 400)
    }

    const existingBrand = await this.brandRepository.findOneBy({ name: brandData.name })
    if (existingBrand && existingBrand.id !== id) {
      throw new AppError("Brand already exists", 400)
    }

    const updatedBrand = await this.brandRepository.update(id, brandData)
    if (!updatedBrand) {
      throw new AppError("Brand not found", 404)
    }

    return updatedBrand
  }

  async patchBrand(id: string, brandData: Partial<IBrand>): Promise<IBrand> {
    if (brandData.name) {
      const existingBrand = await this.brandRepository.findOneBy({ name: brandData.name })
      if (existingBrand && existingBrand.id !== id) {
        throw new AppError("Brand already exists", 400)
      }
    }

    const updatedBrand = await this.brandRepository.update(id, brandData)
    if (!updatedBrand) {
      throw new AppError("Brand not found", 404)
    }
    return updatedBrand
  }

  async deleteBrand(id: string): Promise<void> {
    const result = await this.brandRepository.delete(id)
    if (!result) {
      throw new AppError("Brand not found", 404)
    }
  }

}

