import type { Request, Response, NextFunction } from "express"
import { UserService } from "../services/user.service"
import { UserToCreate, UserToLogin, UserPresenter } from "../types/userDtos"
import { plainToClass } from "class-transformer"
import { JWTService } from "../services/jwt.service"
import { EncodedRequest } from "../types/EncodedRequest"
import { validate } from "class-validator"
import { AppError } from "../utils/AppError"

export class UserController {
  private UserService: UserService
  private JwtService: JWTService

  constructor() {
    this.UserService = new UserService()
    this.JwtService = new JWTService()
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = plainToClass(UserToCreate, req.body)
      const user = await this.UserService.register(userData)
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

      const user = await this.UserService.login(credentials)
      const userPresenter = plainToClass(UserPresenter, user, { excludeExtraneousValues: true })

      const accessToken = this.JwtService.generateAccessToken(user)
      const refreshToken = this.JwtService.generateRefreshToken(user)

      res.status(200).json({userPresenter, token: { accessToken, refreshToken }})
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req: EncodedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.decoded.user
      const accessToken = this.JwtService.generateAccessToken(user)

      res.status(200).json({ accessToken })
    } catch (error) {
      next(error)
    }
  }
}

