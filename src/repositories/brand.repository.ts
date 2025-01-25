import Brand, { type IBrand } from "../models/brand.model"

export class BrandRepository {
  async create(brandData: Partial<IBrand>): Promise<IBrand> {
    const brand = new Brand(brandData)
    return await brand.save()
  }

  async findAll(page: number, limit: number): Promise<{ brands: IBrand[]; total: number }> {
    const skip = (page - 1) * limit
    const [brands, total] = await Promise.all([Brand.find().skip(skip).limit(limit), Brand.countDocuments()])
    return { brands, total }
  }

  async findBy(criteria: Partial<IBrand>): Promise<IBrand | null> {
    return await Brand.findOne({ criteria })
  }

}

