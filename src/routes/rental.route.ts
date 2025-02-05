import { Router } from "express"
import { RentalController } from "../controllers/rentalController"
import { adminMiddleware } from "../middlewares/role.middleware"
import * as Auth from "../middlewares/auth.middleware"
import { RentalToCreate, RentalToModify } from "../types/rentalDtos"
import { EncodedRequest } from "../types/EncodedRequest"

const router = Router()
const rentalController = new RentalController()

router.post("/", Auth.checkJWT, (req, res, next) => rentalController.createRental(req as EncodedRequest, res, next))
router.get("/:id", Auth.checkJWT, (req, res, next) => rentalController.getRental(req as EncodedRequest, res, next))
router.patch("/:id/status", Auth.checkJWT, (req, res, next) => rentalController.updateRentalStatus(req as EncodedRequest, res, next))
router.get("/user/rentals", Auth.checkJWT, (req, res, next) => rentalController.getUserRentals(req as EncodedRequest, res, next))
router.get("/car/:carId/rentals", Auth.checkJWT, (req, res, next) => rentalController.getCarRentals(req as EncodedRequest, res, next))

export const rentalRoutes = router

