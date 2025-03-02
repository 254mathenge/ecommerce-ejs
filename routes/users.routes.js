import {Router} from "express"
import { createUser, deleteUser, getAllUsers, loginUser ,} from "../controllers/users.controllers.js"
import {isAuthenticated } from "../middlewares/auth.middlewares.js";
import { authorizeAdmin } from "../middlewares/users.middleware.js";
const router = Router();

// Protect this route
// router.get("/home", isAuthenticated,authorizeAdmin, (req, res) => {
//     res.render("home", { user: req.user });
// });

// // Protect the user dashboard
// router.get("/user", isAuthenticated, (req, res) => {
//     res.render("user", { user: req.user });
// });

router.get("/",getAllUsers)
router.post("/register" ,createUser) 
router.post("/login",loginUser)
router.delete("/delete" , isAuthenticated, authorizeAdmin,deleteUser)
export default router;