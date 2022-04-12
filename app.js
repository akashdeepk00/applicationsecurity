//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const res = require("express/lib/response");

const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

//Connecting to MongoDB with mongoose
mongoose.connect("mongodb://localhost:27017/userDB");

//creating a schema
const userSchema = {
    email: String,
    password: String
};

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
    const newUser = new UserLogin({ //Need to create a const because we are making a DB entry.
        email : req.body.username,
        password : req.body.password
    });
    newUser.save(function(err){
        if(!err) {
            res.render("secrets");
        } else {
            console.log(err);
        }
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
                if(foundUser.password === password); {
                    res.render("secrets");
                }
            }
        }
    });
    


});

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});