import { Router } from "express"
import { CarController } from "../controllers/car.controller"

const router = Router()
const carController = new CarController()

router.post("/", (req, res, next) => carController.createCar(req, res, next))
router.get("/:id", (req, res, next) => carController.getCar(req, res, next))
router.get("/", (req, res, next) => carController.getCars(req, res, next))
router.put("/:id", (req, res, next) => carController.updateCar(req, res, next))
router.delete("/:id", (req, res, next) => carController.deleteCar(req, res, next))
router.patch("/:id", (req, res, next) => carController.patchCar(req, res, next))

export const carRoutes = router

