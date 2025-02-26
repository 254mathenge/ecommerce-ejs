import {Router} from "express"
import { createProduct, deleteProduct, getAllProducts } from "../controllers/products.controllers.js";
const router = Router();

router.post("/add",createProduct)
router.get("/all",getAllProducts)
router.delete("/delete/:id",deleteProduct)
export default router;