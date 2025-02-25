import usersRoutes from "./routes/users.routes.js";
import express from "express"
import ejs from "ejs"
import path from "path"
import cors from "cors";
import { config } from "dotenv";
import { fileURLToPath } from "url";
config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const app = express()
const port = 3000

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "DELETE", "PATCH"]
  }));


app.set("view engine","ejs")//access any ejs files in views folder
app.set("views",path.join(__dirname,"views"))
app.use(express.json())
//css static
app.use(express.static("public"))
app.get("/",(req,res)=> {
res.render("index",{AdminPage:"register page"}) //do not add the .ejs extension
})

app.use("/users",usersRoutes)
app.get("/home",(req,res)=> {
    const products= [
        {
        id: '1',
    name: 'Sweatshirt With Hood',
    sku: 'ID: 12764398',
    price: 74.34,
    stock: 683,
    image: '/images/shirt.jpg'
  },
  {
    id: '1',
name: 'Sweatshirt With Hood',
sku: 'ID: 12764398',
price: 74.34,
stock: 683,
inStock: true,
image: '/images/shirt.jpg'
},,
{
    id: '1',
name: 'Sweatshirt With Hood',
sku: 'ID: 12764398',
price: 74.34,
stock: 683,
inStock: true,
image: '/images/shirt.jpg'
},
      ];
    res.render("home",{AdminPage:"crm", products }) //do not add the .ejs extension
    })

    app.get("/login",(req,res)=> {
        res.render("login",{AdminPage:"Login page"}) //do not add the .ejs extension
        })

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})