import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


export const createUser = async (req, res) => {
    console.log(req.body)
    try {
        const {email, password } = req.body;
       const hashedPassword=bcrypt.hashSync(password ,10)
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,

            }
        })
        res.status(201).json(newUser)
       
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
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
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (user) {
            const passwordMatch = bcrypt.compareSync(password, user.password)
            if (passwordMatch === true) {
               
                const token = jwt.sign({userid:user.userid}, process.env.SECRET_KEY, { expiresIn: "96h" })

                res.cookie("access_token", token)

                res.status(200).json({ success: true, data: { ...user,token} })
            } else {
                return res.status(400).json({ success: false, message: "Invalid email or password" })
    
            }
        }
        else {
            return res.status(400).json({ success: false, message: "Invalid email or password" })
        }
    }
    catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}