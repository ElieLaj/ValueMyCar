import jwt from "jsonwebtoken"
import { UserRepository } from "../repositories/user.repository"
import { AppError } from "../utils/AppError"
import type { UserToCreate, UserToLogin } from "../types/userDtos"
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

}

