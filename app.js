var express = require('express');
const app = express();
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const seedDB = require('./seed');
//mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser:true});

mongoose.connect("mongodb+srv://tam:sFwhHVpzRWKLqusd@yelpcamp.7odzt.mongodb.net/yelpcamp?retryWrites=true&w=majority")
.then(()=>{
    console.log("connected to database");
})
.catch(()=>{
    console.log("connection failed!");
})

//mongodb+srv://Tameka:1992@yelpcamp.7odzt.mongodb.net/Tameka?retryWrites=true&w=majority



const Comment = require('./models/comment');
const campground = require('./models/campgrounds');
const comment = require('./models/comment');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
const methodOverride = require("method-override");
const flash = require('connect-flash');


app.use(express.static(__dirname + "/public"));

app.use(bodyparser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret: "Cutest dog!!",
    resave: false,
    saveUninitialized:false
}));

app.use(flash());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error =req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(methodOverride("_method"));



const port = process.env.port||8080;

app.set("view engine","ejs");

//seedDB();
//=====================
//PASSPORT CONFIGURATION
//======================



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(port,process.env.IP,()=>{
    console.log(`yelpcamp started on ${port}`);
})