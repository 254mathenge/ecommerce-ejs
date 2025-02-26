import {Router} from "express"
import { createProduct, deleteProduct, getAllProducts,updateProduct } from "../controllers/products.controllers.js";
const router = Router();

router.post("/add",createProduct)
router.get("/all",getAllProducts)
router.delete("/delete/:id",deleteProduct)
router.patch("/update/:id",updateProduct)
export default router;