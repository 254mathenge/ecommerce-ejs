import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();


export const createUser = async (req, res) => {
    const {email,password ,isAdmin} = req.body;
    console.log("registering",{email,password } )
    
    try {

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
    console.log("Login request received:", req.body);
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
               
                const token = jwt.sign({userid:user.userid,isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "96h" })

                res.cookie("access_token", token)
         
              } 
                else {
                return res.status(400).json({ success: false, message: "Invalid email or password" })
    
            }
        }
        if (user.isAdmin) {
            res.redirect("/home");  
        } else {
            res.redirect("/");  
        }
    }
    catch (error) {
        res.status(401).json({ success: false, message: error.message })
    }
}

// export const inviteAdmin = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Check if the requesting user is an admin
//         if (!req.user || !req.user.isAdmin) {
//             return res.status(403).json({ success: false, message: "Access denied. Admins only." });
//         }

//         // Find the user to promote
//         const user = await prisma.user.findUnique({ where: { email } });

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found." });
//         }

//         // Update user to admin
//         const updatedUser = await prisma.user.update({
//             where: { email },
//             data: { isAdmin: true },
//         });

//         res.status(200).json({ success: true, message: `${email} is now an admin`, updatedUser });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };
