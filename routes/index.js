const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const middleware = require('../middleware/index');

router.get('/',(req,res)=>{
    res.render("landing");
});




    //==================
    //Auth Routes

    // show register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'}); 
 });
 
    //handle sign up logic

    router.post("/register",(req,res)=>{
        const newUser = new User({username:req.body.username});
        User.register(newUser,req.body.password,(err,user)=>{
            if(err){
                console.log(err);
                return res.render("register", {error: err.message});
            }
            passport.authenticate("local")(req,res, function(){
                req.flash("success","Welocme to YelpCamp" +" " + user.username);
              res.redirect("/campgrounds");
            });

            
        });
    });

    //show login form

    //show login form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'}); 
 });
    //handling login logic

    router.post("/login",passport.authenticate("local",{
            successRedirect:"/campgrounds",
            failureRedirect:"/login"
   }),(req,res)=>{
      
   })

   //Logout route

   router.get("/logout",(req,res)=>{
       req.logOut();
        req.flash("success","Logged you out!!");
       res.redirect("/campgrounds");
   })
   

   module.exports=router;