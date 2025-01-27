import { FilterQuery } from "mongoose";
import Brand, { type IBrand } from "../models/brand.model"
import { SearchBrandCriteria } from "../types/brandDtos";

export class BrandRepository {
  async create(brandData: Partial<IBrand>): Promise<IBrand> {
    const brand = new Brand(brandData)
    return await brand.save()
  }

  async findAll(page: number, limit: number): Promise<{ brands: IBrand[]; total: number }> {
    const skip = (page - 1) * limit
    const [brands, total] = await Promise.all([Brand.find().populate("cars").skip(skip).limit(limit), Brand.countDocuments()])
    return { brands, total }
  }

  async findOneBy(criteria: FilterQuery<IBrand>): Promise<IBrand | null> {
    return await Brand.findOne(criteria).populate("cars")
  }

  async findBy(filters: Partial<SearchBrandCriteria>, page: number, limit: number): Promise<{ brands: IBrand[]; total: number }> {
    const skip = (page - 1) * limit
    
    const query: FilterQuery<SearchBrandCriteria> = {}
    if (filters.name) query.name = { $regex: filters.name, $options: "i" }
    if (filters.country) query.country = filters.country
    
    const [brands, total] = await Promise.all([Brand.find(query).populate("cars").skip(skip).limit(limit), Brand.countDocuments(query)])
    return { brands, total }
  }

  async update(id: string, brandData: Partial<IBrand>): Promise<IBrand | null> {
    return await Brand.findOneAndUpdate({ id }, brandData, { new: true }).populate("cars")
  }

  async delete(id: string): Promise<boolean> {
    const result = await Brand.deleteOne({ id })
    return result.deletedCount === 1
  }
}

