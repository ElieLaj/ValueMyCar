import jwt from "jsonwebtoken"
import { UserRepository } from "../repositories/user.repository"
import { AppError } from "../utils/AppError"
import type { SearchUserCriteria, UserToCreate, UserToLogin, UserToModify } from "../types/userDtos"
import { IUser, UserRole } from "../models/user.model"

export class UserService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async register(userData: UserToCreate, role: UserRole = UserRole.USER): Promise<IUser> {
    if (userData.role && role !== UserRole.SUPERADMIN && userData.role !== UserRole.USER) {
      throw new AppError("An error occured while creating the user", 400)
    }

    const existingUser = await this.userRepository.findOneBy({email: userData.email})
    if (existingUser) {
      throw new AppError("Email already in use", 400)
    }
    return await this.userRepository.create(userData)
  }

  async login(credentials: UserToLogin): Promise<IUser> {
    const user = await this.userRepository.findOneBy({email: credentials.email})
    if (!user || !(await user.comparePassword(credentials.password))) {
      throw new AppError("Invalid email or password", 401)
    }

    return user
  }

  async getUser(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneBy({id})
    if (!user) {
      throw new AppError("User not found", 404)
    }
    return user
  }

  async getUsers(page = 1, limit = 10): Promise<{ users: IUser[]; total: number; pages: number }> {
    const { users, total } = await this.userRepository.findBy(page, limit)
    const pages = Math.ceil(total / limit)
    return { users, total, pages }
  }

  async updateUser(id: string, userData: UserToModify, currentUserRole: UserRole): Promise<IUser> {
    const user = await this.userRepository.findOneBy({id})
    if (!user) {
      throw new AppError("User not found", 404)
    }

    if (userData.role && userData.role !== user.role && currentUserRole !== UserRole.SUPERADMIN) {
      throw new AppError("You do not have permission to change user roles", 403)
    }

    const updatedUser = await this.userRepository.update(id, userData)
    if (!updatedUser) {
      throw new AppError("Failed to update user", 500)
    }
    return updatedUser
  }

  async deleteUser(id: string, currentUserRole: UserRole): Promise<void> {
    const user = await this.userRepository.findOneBy({id})
    if (!user) {
      throw new AppError("User not found", 404)
    }

    if (currentUserRole === UserRole.USER || (currentUserRole === UserRole.ADMIN && user.role !== UserRole.USER)) {
      throw new AppError("You do not have permission to delete this user", 403)
    }

    const result = await this.userRepository.delete(id)
    if (!result) {
      throw new AppError("Failed to delete user", 500)
    }
  }

}

