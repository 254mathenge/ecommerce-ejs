import {Router} from "express"
import { createUser, deleteUser, getAllUsers, loginUser ,} from "../controllers/users.controllers.js"
import { authorizeAdmin } from "../middlewares/users.middleware.js";
const router = Router();
router.get("/",getAllUsers)
router.post("/register" ,createUser) 
router.post("/login",loginUser ,authorizeAdmin)
router.delete("/delete",deleteUser)
// router.patch("/inviteAdmin",inviteAdmin,authorizeAdmin)
router.get("/admin", authorizeAdmin, (req, res) => {
    res.render("home");
});
export default router;