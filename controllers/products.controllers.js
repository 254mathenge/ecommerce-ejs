
import { PrismaClient } from "@prisma/client";
import upload from "../middlewares/multer.middlewares.js";
import cloudinary from "../utils/cloudinary.js"
const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
    try {
        // Multer Middleware to Handle Image Upload
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Multer error: " + err.message });
            }

            const { name, sku, price, stock } = req.body;
            console.log({ name, sku, price, stock, image: req.file?.path });

            // Upload image to Cloudinary
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

            // Save product details to database
            const product = await prisma.product.create({
                data: {
                    name: name,
                    sku: sku,
                    price: parseFloat(price),
                    stock: parseInt(stock),
                    image: cloudinaryResult.secure_url, // Use Cloudinary image URL
                },
            });

            console.log("Product created:", product);
            res.redirect("/home");
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllProducts =async(req, res) => {

    try {
        const products= await prisma.product.findMany();
        res.render("products", { products });

    } 
    catch (error) {
        res.status(500).json({success:false ,message:error.message})
  }
}
export const deleteProduct =async(req, res) => {
    const id = req.params.id;
    try {
        const productId = parseInt(req.params.id, 10);
        const products= await prisma.product.delete({
            where:{
                id:productId
            }

        });
        res.redirect("/products"); 

    } 
    catch (error) {
        res.status(500).json({success:false ,message:error.message})
  }
}
