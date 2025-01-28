import { Router } from "express"
import { CarController } from "../controllers/car.controller"
import * as Auth from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/role.middleware"
import { EncodedRequest } from "../types/EncodedRequest"

const router = Router()
const carController = new CarController()

router.post("/", Auth.checkJWT, (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => carController.createCar(req as EncodedRequest, res, next))
router.get("/:id", Auth.checkJWT, (req, res, next) => carController.getCar(req, res, next))
router.get("/", Auth.checkJWT, (req, res, next) => carController.getCars(req, res, next))
router.put("/:id", Auth.checkJWT, (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => carController.updateCar(req, res, next))
router.delete("/:id", Auth.checkJWT, (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => carController.deleteCar(req, res, next))
router.patch("/:id", Auth.checkJWT, (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => carController.patchCar(req, res, next))

export const carRoutes = router

