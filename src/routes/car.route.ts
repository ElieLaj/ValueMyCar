import { Router } from "express"
import { CarController } from "../controllers/car.controller"

const router = Router()
const carController = new CarController()

router.post("/", (req, res) => carController.createCar(req, res))
router.get("/:id", (req, res) => carController.getCar(req, res))
router.get("/", (req, res) => carController.getCars(req, res))
router.put("/:id", (req, res) => carController.updateCar(req, res))
router.delete("/:id", (req, res) => carController.deleteCar(req, res))

export const carRoutes = router

