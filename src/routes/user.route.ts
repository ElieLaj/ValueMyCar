import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import * as Auth from "../middlewares/auth.middleware"
import { EncodedRequest } from "../types/EncodedRequest"
import { adminMiddleware } from "../middlewares/role.middleware"

const router = Router()
const userController = new UserController()

router.post("/register", Auth.checkRole, (req, res, next) => userController.register(req as EncodedRequest, res, next))

router.post("/login",(req, res, next) => userController.login(req, res, next))
router.post("/refresh-token", Auth.checkJWTSecret, (req, res, next) => userController.refreshToken(req as EncodedRequest, res, next))

router.get("/", Auth.checkJWT, (req, res, next) => userController.getUsers(req, res, next))
router.get("/:id", Auth.checkJWT, (req, res, next) => userController.getUser(req, res, next))

router.put("/:id", Auth.checkJWT, (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => userController.updateUser(req as EncodedRequest, res, next))
router.delete("/:id", Auth.checkJWT, (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => userController.deleteUser(req as EncodedRequest, res, next))

export const userRoutes = router

