import { Router } from "express"
import { BrandController } from "../controllers/brand.controller"
import * as Auth from "../middlewares/auth.middleware"
import { adminMiddleware } from "../middlewares/role.middleware"
import { EncodedRequest } from "../types/EncodedRequest"

const router = Router()
const brandController = new BrandController()

router.post("/", Auth.checkJWT, (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => brandController.createBrand(req, res, next))
router.get("/", Auth.checkJWT, (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => brandController.getBrands(req, res, next))
router.get("/:id/cars", Auth.checkJWT, (req, res, next) => brandController.getBrandCars(req, res, next))
router.put("/:id", Auth.checkJWT,  (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => brandController.updateBrand(req, res, next))
router.delete("/:id", Auth.checkJWT,  (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => brandController.deleteBrand(req, res, next))
router.patch("/:id", Auth.checkJWT,  (req, res, next) => adminMiddleware(req as EncodedRequest, res, next), (req, res, next) => brandController.patchBrand(req, res, next))

export const brandRoutes = router

