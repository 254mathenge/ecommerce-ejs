import {Router} from "express"
import { createProduct, getAllProducts } from "../controllers/products.controllers.js";
const router = Router();

router.post("/add",createProduct)
router.get("/all",getAllProducts)
export default router;