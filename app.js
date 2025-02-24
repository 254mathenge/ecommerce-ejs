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
    const products= [
        {
        id: '1',
    name: 'Sweatshirt With Hood',
    sku: 'ID: 12764398',
    price: 74.34,
    stock: 683,
    image: ''
  },
  {
    id: '1',
name: 'Sweatshirt With Hood',
sku: 'ID: 12764398',
price: 74.34,
stock: 683,
inStock: true,
image: ''
},,
{
    id: '1',
name: 'Sweatshirt With Hood',
sku: 'ID: 12764398',
price: 74.34,
stock: 683,
inStock: true,
image: ''
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