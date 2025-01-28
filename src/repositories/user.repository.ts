import { FilterQuery } from "mongoose";
import User, { type IUser } from "../models/user.model"
import { SearchUserCriteria } from "../types/userDtos";

export class UserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData)
    return await user.save()
  }

  async findOneBy(filters: SearchUserCriteria): Promise<IUser | null> {
    const query: FilterQuery<SearchUserCriteria> = {}
    if (filters.email) query.email = filters.email
    if (filters.id) query.id = filters.id

    return await User.findOne(query)
  }

  async findBy(filters: SearchUserCriteria, page: number, limit: number): Promise<{ brands: IUser[]; total: number }> {
    const skip = (page - 1) * limit
    
    const query: FilterQuery<SearchUserCriteria> = {}
    if (filters.email) query.email = filters.email
    
    const [brands, total] = await Promise.all([User.find(query).skip(skip).limit(limit), User.countDocuments(query)])
    return { brands, total }
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await User.findOneAndUpdate({ id }, userData, { new: true })
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.deleteOne({ id })
    return result.deletedCount === 1
  }
}

