const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


app.use(express.json());
app.use(cors());

// Database Connection With MongoDB
mongoose.connect("mongodb+srv://ankitapratihar:ttno6a5RtWGTwqNn@cluster0.coifnmb.mongodb.net/ecommerce");

// API Creation

app.get("/", (req,res) => {
    res.send("Express App is Running")
})

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb) => {
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

// Creating upload endpoint for images
app.use('/images',express.static('upload/images'))

// API for uploading an image
app.post("/upload", upload.single('product'), (req,res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schemas 
const Product = mongoose.model("Product",{
    id:{type: Number, required: true},
    name:{type: String, required: true},
    image:{type: String, required: true},
    category:{type: String, required: true},
    new_price:{type: Number, required: true},
    old_price:{type: Number, required: true},
    date:{type: Date, default: Date.now},
    available:{type: Boolean, default: true},
})

const User = mongoose.model("User", {
    username:{type: String},
    email:{type: String, unique: true},
    password:{type: String},
    cartData:{type: Object},
    date:{type:Date, default: Date.now}
})

// API for adding a product
app.post('/add-product', async (req,res) => {
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id = 1;
    }

    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
})

// API for removing products
app.post('/remove-product', async (req,res) => {
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})

// API for getting all products
app.get('/all-products', async (req,res) => {
    let all_products = await Product.find({});
    console.log("All Products Fetched");
    res.send(all_products);
})

// API for getting new collection (8 recently added items)
app.get('/newcollections', async (req,res) => {
    let products = await Product.find({});
    let newcollection =products.slice(1).slice(-8);
    console.log("NewCollection fetched");
    res.send(newcollection);
})

// API for getting popular products
app.get('/popularinwomen', async (req,res) => {
    let products = await Product.find({category: "women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
})

// Middleware API to fetch user
const fetchUser = async (req,res,next) => {
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please authenticate using valid token"});
    }else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({error: "Please authenticate using valid token"});
        }
    }
}

// API for adding products to cartData
app.post('/addtocart', fetchUser, async (req,res) => {
    // console.log(req.body, req.user);
    console.log("Added ", req.body.itemId);
    let userData = await User.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate({_id: req.user.id},{cartData: userData.cartData});
    res.send("Added to Cart");
})

// API for removing products from cartData
app.post('/removefromcart', fetchUser, async (req,res) => {
    console.log("Removed ", req.body.itemId);
    let userData = await User.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId] > 0){
        userData.cartData[req.body.itemId] -= 1;
    }
    await User.findOneAndUpdate({_id: req.user.id},{cartData: userData.cartData});
    res.send("Removed from Cart");
})

// API to get cartData
app.post('/getcart', fetchUser, async (req,res) => {
    console.log("GetCart");
    //console.log(req.body.id);
    //console.log(req.user.id);
    let userData = await User.findOne({_id: req.user.id});
    res.json(userData.cartData);
})

// API for registering user
app.post('/signup', async (req,res) => {
    let check = await User.findOne({email:req.body.email});
    if (check){
        return res.status(400).json({success: false, error: "Existing user found with same email address"});
    }
    let cart = {};
    for(let i = 0; i < 300; i++){
        cart[i] = 0;
    }

    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })

    await user.save();
    
    const data = {
        user:{id: user.id}
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success: true, token});
})

// API for login
app.post('/login', async (req,res) => {
    let user = await User.findOne({email:req.body.email});
    if(user){
        const passwordCompare = req.body.password === user.password;
        if(passwordCompare){
            const data = {user:{id: user.id}};
            const token = jwt.sign(data,'secret_ecom');
            res.json({success: true, token});
        }else{
            res.json({success: false, error: "Invalid Password"});
        }
    }else{
        res.json({success: false, error: "User does not exist"})
    }
})



app.listen(port, (error) => {
    if (!error){
        console.log("Server running on port " + port);
    }else{
        console.log("Error: " + error);
    }
});
