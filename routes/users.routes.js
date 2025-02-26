import {Router} from "express"
import { createUser, getAllUsers, loginUser } from "../controllers/users.controllers.js"
const router = Router();
router.get("/",getAllUsers)
router.post("/register" ,createUser) 
router.post("/login",loginUser)
export default router;