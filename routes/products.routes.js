import {Router} from "express"
import { createProduct, deleteProduct, getAllProducts,updateProduct ,getProductsByCategory,getProductsByPrice} from "../controllers/products.controllers.js";
const router = Router();

router.post("/add",createProduct)
router.get("/all",getAllProducts)
router.delete("/delete/:id",deleteProduct)
router.patch("/update/:id",updateProduct)
router.get("/category/:category", getProductsByCategory);
router.get("/price/:price", getProductsByPrice)
export default router;