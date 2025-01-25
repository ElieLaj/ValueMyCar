import { Router } from "express"
import { BrandController } from "../controllers/brand.controller"

const router = Router()
const brandController = new BrandController()

router.post("/", (req, res) => brandController.createBrand(req, res))
router.get("/", (req, res) => brandController.getBrands(req, res))


export const brandRoutes = router

