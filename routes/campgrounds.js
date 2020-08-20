const express = require('express');
const router = express.Router();
const campground = require("../models/campgrounds");
const middleware = require('../middleware/index');

/*router.get('/campgrounds',(req,res)=>{


    campground.find({},(err,allCampgrounds)=>{
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{camp:allCampgrounds,currentUser:req.user});
        }
    })
   
   // res.render("campgrounds",{camp:campgrounds});
})*/
// Define escapeRegex function for search feature
//INDEX - show all campgrounds
router.get("/campgrounds", function(req, res){
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campgrounds/index",{camp:allCampgrounds,currentUser:req.user, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{camp: allCampgrounds, page: 'campgrounds',currentUser:req.user, noMatch: noMatch});
           }
        });
    }
});

router.post("/camp",middleware.isLoggedIn,(req,res)=>{
  //get data from form and add to campgrounds array

  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author ={
      id:req.user._id,
      username:req.user.username
  }
  var newCampgrounds = {name:name,price:price,image:image,description:desc,author:author    };
  
  campground.create(newCampgrounds,(err,newlyCreated)=>{
      if(err){
          console.log(err);
      }else{
        res.redirect("/campgrounds")
      }
  })
  //redirect back to campgrounds page

  
})

router.get("/campgrounds/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new.ejs");
})
//show all campgrounds by id
router.get("/campgrounds/:id",(req,res)=>{
    campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundcampground);
            res.render("campgrounds/show",{campground:foundcampground,currentUser:req.user});
        }
    });

    
});

//EDIT CAMPGROUNDS Routes
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
   
        campground.findById(req.params.id,(err,foundcampground)=>{
            
                    res.render("campgrounds/edit",{campground:foundcampground,currentUser:req.user});
                

    });
 
});

//update campgrounds routes

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    //find and update the correct campgrounds
    
    campground.findByIdAndUpdate(req.params.id, req.body.campground,(err,updatedCampground)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
     
    })

})

//DELETE CAMP
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    campground.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;