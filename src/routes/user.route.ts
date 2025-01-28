import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import * as Auth from "../middlewares/auth.middleware"
import { EncodedRequest } from "../types/EncodedRequest"

const router = Router()
const userController = new UserController()

router.post("/register", (req, res, next) => userController.register(req, res, next))

router.post("/login",(req, res, next) => userController.login(req, res, next))
router.post("/refresh-token", Auth.checkJWTSecret, (req, res, next) => userController.refreshToken(req as EncodedRequest, res, next))

export const userRoutes = router

