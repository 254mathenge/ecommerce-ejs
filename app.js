import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js"
import { isAuthenticated ,isAdmin} from "./middlewares/auth.middlewares.js";
import session from "express-session";

import cookieParser from "cookie-parser";
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
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["POST", "GET", "DELETE", "PATCH"],
    credentials: true, // Allow credentials (cookies, authorization headers)
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
            "https://cdnjs.cloudflare.com" 
          ],
          imgSrc: [
            "'self'",
            "data:",
            "https://res.cloudinary.com" 
          ],
        },
      },
    })
  );
  

  app.use(
    session({
      secret: "your_secret_key", // Replace with a strong secret
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }, // Set to `true` if using HTTPS
    })
  );

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
//css static
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index", { AdminPage: "register page", error: null} ); 
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

app.get("/home",isAuthenticated,isAdmin, async (req, res) => {
    try {
      const products = await prisma.product.findMany();
      res.render("home", { AdminPage: "crm", products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    }
  });

app.get("/login", (req, res) => {
  res.render("login", { AdminPage: "Login page" }); 
});
app.get("/user",isAuthenticated, async(req, res) => {
  try {
    const products = await prisma.product.findMany(); // Fetch from DB
    res.render("user", { AdminPage: "User Page", products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/product", (req, res) => {
    res.render("product", { AdminPage: "New Products" }); 
  })

  app.get("/logout", (req, res) => {
    res.clearCookie("access_token"); // Clears the authentication token
    res.redirect("/login"); // Redirects user to login page
});

app.get("/cart", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = []; // Initialize cart if undefined
  }
  res.render("cart", { AdminPage: "register page", cart: req.session.cart });
});

app.post("/add-to-cart", async (req, res) => {
  const productId = parseInt(req.body.productId);

  try {
    // ✅ Fetch product from database
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // ✅ Ensure cart session exists
    if (!req.session.cart) {
      req.session.cart = [];
    }

    // ✅ Add product to session cart
    req.session.cart.push(product);
    res.redirect("/cart");
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
