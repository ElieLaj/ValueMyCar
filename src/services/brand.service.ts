import { BrandRepository } from "../repositories/brand.repository"
import type { IBrand } from "../models/brand.model"
import { AppError } from "../utils/AppError"
import { ICar } from "../models/car.model"
import { BrandToModify, BrandToReplace, SearchBrandCriteria } from "../types/brandDtos"

export class BrandService {
  private brandRepository: BrandRepository

  constructor() {
    this.brandRepository = new BrandRepository()
  }

  async createBrand(brandData: Partial<IBrand>): Promise<IBrand> {
    const brand = await this.brandRepository.findOneBy({ name: brandData.name})

    if (brand) {
      throw new AppError("Brand already exists", 400)
    }

    return await this.brandRepository.create(brandData)
  }

  async getBrands(searchCriteria: SearchBrandCriteria): Promise<{ brands: IBrand[]; total: number; pages: number }> {
    const { page = 1, limit = 10, ...filters } = searchCriteria
    const { brands, total } = await this.brandRepository.findBy(filters, page, limit)
    const pages = Math.ceil(total / limit)
    return { brands, total, pages }
  }

  async getBrand(id: string): Promise<IBrand> {
    const brand = await this.brandRepository.findOneBy({id})
    if (!brand) {
      throw new AppError("Brand not found", 404)
    }
    return brand
  }

  async getBrandCars(id: string): Promise<ICar[]> {
    const brand = await this.brandRepository.findOneBy({id})
    if (!brand) {
      throw new AppError("Brand not found", 404)
    }

    return brand.cars
  }

  async updateBrand(id: string, brandData: BrandToReplace): Promise<IBrand> {
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

  async patchBrand(id: string, brandData: BrandToModify): Promise<IBrand> {
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
    const brand = await this.brandRepository.findOneBy({id})
    if (!brand) {
      throw new AppError("Brand not found", 404)
    }

    if (brand.cars.length > 0) {
      throw new AppError("Cannot delete brand with associated cars", 400)
    }

    const result = await this.brandRepository.delete(id)
    if (!result) {
      throw new AppError("Failed to delete brand", 500)
    }
  }

}

