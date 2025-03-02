import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


export const createUser = async (req, res) => {
    const {email,password ,isAdmin} = req.body;
    console.log("registering",{email,password } )
    
    // if (password.length !== 5) {
    //     return res.status(400).send("Password must be exactly 5 characters long");
    //   }
    

    try {
        const existingUser = await prisma.user.findUnique({ where: { email:email } });

        if (existingUser) {
            console.log("user currently exists" );
            return res.render("index", { AdminPage: "register page",error: "Email already exists. Please use a different one." });
        }

        const hashedPassword=  bcrypt.hashSync(password ,10)
        
       const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                isAdmin: false 
            }
        })
        console.log("User registered:", newUser);
        res.redirect("/login");  
    } catch (error) {
        res.render("index", { 
            AdminPage: "register page",
            error: "An error occurred. Please try again later." 
        });
    }
}
export const getAllUsers =async(req, res) => {
    try {
        const users= await prisma.user.findMany();
        res.status(200).json(users)
    } 
    catch (error) {
        res.status(500).json({success:false ,message:error.message})
  }
}


export const loginUser = async (req, res) => {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ userid: user.userid, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "96h" });
        res.cookie("access_token", token, { httpOnly: true });

        return res.redirect(user.isAdmin ? "/home" : "/user");
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};




export const deleteUser = async (req, res) => {
    const id = req.params.id
    try {
        const deleteUser = await prisma.user.delete({
            where: {
                id:UserId
            },

        })
        res.status(200).json(deleteUser)
    } 
    catch (error) {
        res.status(500).json({success:false ,message:error.message})
  }
}