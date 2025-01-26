import { Router } from "express"
import { BrandController } from "../controllers/brand.controller"

const router = Router()
const brandController = new BrandController()

router.post("/", (req, res, next) => brandController.createBrand(req, res, next))
router.get("/", (req, res, next) => brandController.getBrands(req, res, next))


export const brandRoutes = router

