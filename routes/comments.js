//------------------------cooments routes------------------------//
const express = require('express');
const router = express.Router();
const campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const comment = require('../models/comment');
const middleware = require('../middleware/index');

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,(req,res)=>{
    campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log("error");
        }else{
            res.render("comments/new",{campground:campground,currentUser:req.user});
        }
    })
    
})

router.post("/campgrounds/:id/comments",middleware.isLoggedIn,(req,res)=>{
    //lookup for campgrounds using ID

    campground.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }else{
        Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                     comment.author.username = req.user.username;
                     comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comments!!");
                    res.redirect('/campgrounds/' +campground._id);
                }
            })
        }
    })
    //create a new comment
    //connect new comment to campground
    //redirect campgroun show page


} )
//comments edit
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    comment.findById(req.params.comment_id,(err,foundComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
        }
    })
  
})
//comments update

router.put("/campgrounds/:campground_id/comments/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err,updatedComment)=>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds");
        }
     
    });
});

//comment destroy route

router.delete("/campgrounds/:campground_id/comments/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
    //findbyid and remove
    comment.findByIdAndRemove(req.params.comment_id,(err)=>{
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comments deleted");
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;
