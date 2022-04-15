//jshint esversion:6
//require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const res = require("express/lib/response");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

//Connecting to MongoDB with mongoose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});

//creating a schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    unencryptedPassword: String
});

//schema plugin & which field to encrypt. encrypt password regardless of any other options will be left unencrypted
//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] }); 

//creating a model with Mongoose
const UserLogin = new mongoose.model("UserLogin", userSchema);


//rendering the ejs pages
app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

        const newUser = new UserLogin({ //Need to create a const because we are making a DB entry.
            email : req.body.username,
            password : hash,
            unencryptedPassword : req.body.password
        });
        
        // Store hash in your password DB.
        newUser.save(function(err){
            if(!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });
});

app.post("/login", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    UserLogin.findOne({email:username}, function(err, foundUser) {
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if(result === true){
                    res.render("secrets"); }
                });
                //if(foundUser.password === password) {}
            }
        }
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});