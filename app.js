const express =require("express")
const app = express()
const port = 3000
const path = require("path")
app.set("view engine","ejs")//access any ejs files in views folder
app.set("views",path.join(__dirname,"views"))
//css static
app.use(express.static("public"))
app.get("/",(req,res)=> {
res.render("index",{AdminPage:"register page"}) //do not add the .ejs extension
})

app.get("/home",(req,res)=> {
    const products = [
        { id: 1, name: "Laptop", price: 1000, stock: 500, instock: "", active: "yes" },
        { id: 2, name: "Smartphone", price: 800, stock: 300, instock: "", active: "yes" },
        { id: 3, name: "Tablet", price: 600, stock: 200, instock: "", active: "no" },
      ];
    res.render("home",{AdminPage:"crm", products }) //do not add the .ejs extension
    })

    app.get("/login",(req,res)=> {
        res.render("login",{AdminPage:"Login page"}) //do not add the .ejs extension
        })

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})