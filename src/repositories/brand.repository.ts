import { FilterQuery } from "mongoose";
import Brand, { type IBrand } from "../models/brand.model"

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

  async findBy(criteria: Partial<IBrand>, page: number, limit: number): Promise<{ brands: IBrand[]; total: number }> {
    const skip = (page - 1) * limit
    const [brands, total] = await Promise.all([Brand.find(criteria as FilterQuery<IBrand>).populate("cars").skip(skip).limit(limit), Brand.countDocuments()])
    return { brands, total }
  }

  async findById(id: string): Promise<IBrand | null> {
    return await Brand.findOne({ id }).populate("cars")
  }

  async update(id: string, brandData: Partial<IBrand>): Promise<IBrand | null> {
    return await Brand.findOneAndUpdate({ id }, brandData, { new: true }).populate("cars")
  }

  async delete(id: string): Promise<boolean> {
    const result = await Brand.deleteOne({ id })
    return result.deletedCount === 1
  }
}

