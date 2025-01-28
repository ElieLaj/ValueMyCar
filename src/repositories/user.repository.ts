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

  async findBy(page: number, limit: number): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit
    
    const [users, total] = await Promise.all([User.find().skip(skip).limit(limit), User.countDocuments()])
    return { users, total }
  }

  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return await User.findOneAndUpdate({ id }, userData, { new: true })
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.deleteOne({ id })
    return result.deletedCount === 1
  }
}

