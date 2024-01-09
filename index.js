const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//to make date readable
const ejs = require("ejs");
const dotenv = require("dotenv");
const path=require("path");
//to hide mongoDB passsword
dotenv.config();
const app = express ();
//an instance of express

//to hide password

const port = process.env.PORT || 3000;
//mongoose.connect("mongodb+srv://sidhisreee:<paxton5229>@cluster0.9yofmt1.mongodb.net/?retryWrites=true&w=majority");

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.9yofmt1.mongodb.net/RegistrationformDB`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

//model of registration schema
const Registration = mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.post("/register", async(req,res)=> {
    try{
        const {name,email,password} = req.body;
        const existingUser=await Registration.findOne({email:email});
        //check for existing user
        if (!existingUser){
            const registrationData = new Registration({
                name,
                email,
                password
        });
        await registrationData.save();
        res.redirect("/success.html");
    }
        
        else{
            console.log("User already exist");
            res.redirect("/error.html");
        }
    }  
    catch(error){
        console.log(error);
        res.redirect("/error.html");
    }
});

app.get("/success",(req,res)=>{
    res.sendFile(path.join(__dirname,"success.html"));
})

app.get("/error",(req,res)=>{
    res.sendFile(path.join(__dirname,"error.html"));
})
app.listen(port, ()=>{
    console.log(`server is running on port ${port} `);
})