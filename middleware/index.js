//all middleware goes here
const campground = require('../models/campgrounds');
const   comment = require('../models/comment');
const flash = require('connect-flash');

const middlewareObj = {

}
middlewareObj.checkCampgroundOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            campground.findById(req.params.id,(err,foundcampground)=>{
                if(err){
                    req.flash("errors","campgrounds not found!!");
                    res.redirect("back");
                }else{
                    //does user own the campgrounds
                    if(foundcampground.author.id.equals(req.user._id)){
                        next();
                        //res.render("campgrounds/edit",{campground:foundcampground,currentUser:req.user});
                    }else{
                        req.flash("error","You dont have permission to do that");
                        res.redirect("back");
                    }
                  
                }
            })
    
    
        }else{
            req.flash("errors","you need to be logged in to do that");
            res.redirect("back");
    
        }
     
    }
    
    


middlewareObj.checkCommentOwnership = function(req,res,next){
          if(req.isAuthenticated()){
            comment.findById(req.params.comment_id,(err,foundComment)=>{
                if(err){
                    res.redirect("back");
                }else{
                    //does user own the campgrounds
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                        //res.render("campgrounds/edit",{campground:foundcampground,currentUser:req.user});
                    }else{
                        req.flash("error","You dont ahve permission to do that  ");
                        res.redirect("back");
                    }
                  
                }
            })
    
    
        }else{
            res.redirect("back");
    
        }
     
    }

  middlewareObj.isLoggedIn=  function (req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","You need to be logged In!");
        res.redirect("/login");
    }

module.exports = middlewareObj