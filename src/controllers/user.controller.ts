import type { Request, Response, NextFunction } from "express"
import { UserService } from "../services/user.service"
import { UserToCreate, UserToLogin, UserPresenter, UserToModify } from "../types/userDtos"
import { plainToClass } from "class-transformer"
import { JWTService } from "../services/jwt.service"
import { EncodedRequest } from "../types/EncodedRequest"
import { validate } from "class-validator"
import { AppError } from "../utils/AppError"
import { UserRole } from "../models/user.model"

export class UserController {
  private userService: UserService
  private jwtService: JWTService

  constructor() {
    this.userService = new UserService()
    this.jwtService = new JWTService()
  }

  async register(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = plainToClass(UserToCreate, req.body)

      const dtoErrors = await validate(userData);
    
      if (dtoErrors.length > 0) {
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
      }

      const user = await this.userService.register(userData, req?.decoded?.user?.role || UserRole.USER)
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true })

      res.status(201).json(userPresenter)
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials = plainToClass(UserToLogin, req.body)

      const dtoErrors = await validate(credentials);
    
      if (dtoErrors.length > 0) {
        const constraints = dtoErrors.map(error => Object.values(error.constraints || {})).flat();
        const errors = constraints.map(constraint => constraint || "").join(", ");
        throw new AppError(errors || "Invalid input", 400);
      }

      const user = await this.userService.login(credentials)
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true })

      const accessToken = this.jwtService.generateAccessToken(user)
      const refreshToken = this.jwtService.generateRefreshToken(user)

      res.status(200).json({userPresenter, token: { accessToken, refreshToken }})
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.decoded.user
      const accessToken = this.jwtService.generateAccessToken(user)

      res.status(200).json({ accessToken })
    } catch (error) {
      next(error)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userService.getUser(req.params.id)
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true })
      res.status(200).json(userPresenter)
    } catch (error) {
      next(error)
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number.parseInt(req.query.page as string) || 1
      const limit = Number.parseInt(req.query.limit as string) || 10
      const result = await this.userService.getUsers(page, limit)
      const userPresenters = plainToClass(UserPresenter, result.users, { excludeExtraneousValues: true })
      res.status(200).json(userPresenters)
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = plainToClass(UserToModify, req.body)
      const updatedUser = await this.userService.updateUser(req.params.id, userData, req.decoded.user.role as UserRole)
      const userPresenter = plainToClass(UserPresenter, updatedUser, { excludeExtraneousValues: true })
      res.status(200).json(userPresenter)
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.userService.deleteUser(req.params.id, req.decoded.user!.role as UserRole)
      res.status(204).json({message: "User deleted"})
    } catch (error) {
      next(error)
    }
  }
}

