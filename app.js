import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js"
import express from "express";
import ejs from "ejs";
import path from "path";
import cors from "cors";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;



app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "DELETE", "PATCH"],
  })
);

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
          objectSrc: ["'none'"],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://cdnjs.cloudflare.com" // Allow Font Awesome
          ],
          imgSrc: [
            "'self'",
            "data:",
            "https://res.cloudinary.com" // Allow Cloudinary images
          ],
        },
      },
    })
  );
  



app.set("view engine", "ejs"); //access any ejs files in views folder
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
//css static
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index", { AdminPage: "register page" }); //do not add the .ejs extension
});

app.use("/users", usersRoutes);
app.use("/products",productsRoutes)
// app.get("/home", (req, res) => {
//   const products = [
//     {
//       id: "1",
//       name: "Sweatshirt With Hood",
//       sku: "ID: 12764398",
//       price: 74.34,
//       stock: 683,
//       image: "/images/shirt.jpg",
//     },
//     {
//       id: "1",
//       name: "Sweatshirt With Hood",
//       sku: "ID: 12764398",
//       price: 74.34,
//       stock: 683,
//       inStock: true,
//       image: "/images/shirt.jpg",
//     },
//     ,
//     {
//       id: "1",
//       name: "Sweatshirt With Hood",
//       sku: "ID: 12764398",
//       price: 74.34,
//       stock: 683,
//       inStock: true,
//       image: "/images/shirt.jpg",
//     },
//   ];
//   res.render("home", { AdminPage: "crm", products }); //do not add the .ejs extension
// });

app.get("/home", async (req, res) => {
    try {
      const products = await prisma.product.findMany(); // Fetch from DB
      res.render("home", { AdminPage: "crm", products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  });

app.get("/login", (req, res) => {
  res.render("login", { AdminPage: "Login page" }); //do not add the .ejs extension
});

app.get("/product", (req, res) => {
    res.render("product", { AdminPage: "New Products" }); //do not add the .ejs extension
  })

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
