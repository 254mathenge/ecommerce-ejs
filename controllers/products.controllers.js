
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createProduct= async(req,res)=>{
    const {name,sku,price,stock,image}=req.body
    console.log({name,sku,price,stock,image});


    try{
        const product=await prisma.product.create({
            data:{
                name:name,
                sku:sku,
                price:price,
                stock:stock,
                image:image,
            }
        })
        console.log("product created");
        res.redirect("/")
    }catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}