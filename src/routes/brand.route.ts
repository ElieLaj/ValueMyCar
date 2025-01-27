import { Router } from "express"
import { BrandController } from "../controllers/brand.controller"

const router = Router()
const brandController = new BrandController()

router.post("/", (req, res, next) => brandController.createBrand(req, res, next))
router.get("/", (req, res, next) => brandController.getBrands(req, res, next))
router.get("/:id/cars", (req, res, next) => brandController.getBrandCars(req, res, next))
router.put("/:id", (req, res, next) => brandController.updateBrand(req, res, next))
router.delete("/:id", (req, res, next) => brandController.deleteBrand(req, res, next))
router.patch("/:id", (req, res, next) => brandController.patchBrand(req, res, next))

export const brandRoutes = router

