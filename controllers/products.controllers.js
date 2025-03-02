
import { PrismaClient } from "@prisma/client";
import upload from "../middlewares/multer.middlewares.js";
import cloudinary from "../utils/cloudinary.js"

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
    try {
        
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Multer error: " + err.message });
            }

            const { name,category, sku, price, stock } = req.body;
            console.log({ name, sku, price, stock,category, image: req.file?.path});

            // image: req.file?.path
            const cloudinaryResult = await cloudinary.uploader.upload(req.file.path);

           
            const products = await prisma.product.create({
                data: {
                    name: name,
                    category:category,
                    sku: sku,
                    price: parseFloat(price),
                    stock: parseInt(stock),
                    image: cloudinaryResult.secure_url, 
                },
            });

            console.log("Product created:", products);
            res.render("home", { AdminPage: "crm", products });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllProducts =async(req, res) => {

    try {
        const products= await prisma.product.findMany();
      
        console.log(products);

        if (!Array.isArray(products)) {
            console.error("Products is not an array:", products);
            return res.render("home", { AdminPage: "crm", products: [] }); // Pass empty array to avoid errors
          }
        // res.json(products)
    
    res.render("home", { AdminPage: "crm", products });
    }catch (error) {
        res.status(500).json({success:false ,message:error.message})
  }
}

export const deleteProduct =async(req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log("deleting");
    try {
        const productId = parseInt(req.params.id, 10);
        const products= await prisma.product.delete({
            
            where:{
                id:productId
            }
        });
        console.log(products);
        // res.json(products)
        res.redirect("/home"); 
        // res.render("home", { AdminPage: "crm", products });
    } 
    catch (error) {
        res.status(500).json({success:false ,message:error.message})
  }
}

export const updateProduct = async(req, res) => {
    const id = req.params.id;
    const { name, sku, price, stock ,category, image } = req.body;
    console.log({ name, sku, price, stock,category, image },"updating");
    try {
        console.log("Headers:", req.headers);
        console.log("Request Body:", req.body);
        const productId = parseInt(req.params.id, 10);

        

        const updatedData = {};
        if (name) updatedData.name = name;
        if (sku) updatedData.sku = sku;
        if (price) updatedData.price = price;
        if (stock) updatedData.stock = stock;
        if (category) updatedData.category = category;
        if (image) updatedData.image = image;

        const products = await prisma.product.update({
            where: { id: productId },
            data: updatedData,
        });

        res.redirect("/product"); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductsByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const products = await prisma.product.findMany({
            where: { category }
        });
        console.log(products);
        // res.json(products);
        res.render("home", { AdminPage: "crm", products });
    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
};

export const getProductsByPrice = async (req, res) => {
    console.log("Fetching products by price range...");
    const { price } = req.params;

    let priceFilter = {};
    
    if (price !== "allPrices") {
        if (price.includes("+")) {
            const minPrice = parseInt(price.replace("+", ""), 10);
            priceFilter = { price: { gte: minPrice } };
        } else {
            const [minPrice, maxPrice] = price.split("-").map(Number);
            priceFilter = { price: { gte: minPrice, lte: maxPrice } }; 
        }
    }

    try {
        const products = await prisma.product.findMany({
            where: priceFilter
        });
        console.log(products);
        // res.json(products);

        res.render("home", { AdminPage: "crm", products });
    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
};
