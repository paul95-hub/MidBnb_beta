var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
// INDEX - show all flats
router.get("/",function(req,res){
	//all cg from DB
	Campground.find({},function(err, allCampgrounds){
		if (err){
			console.log(err);
		} else{
			res.render("flats/index",{campgrounds:allCampgrounds,currentUser: req.user});
		}
	});
	
});
//CREATE - add new cmapgound to db
router.post("/",middleware.isLoggedIn,function(req,res){
	var name =req.body.name;
	var price = req.body.price;
	var city = req.body.city;
	var postcode = req.body.postcode;
	var image =req.body.image;
	var desc =req.body.description;
	var author = {
		id: req.user._id,
		username:req.user.username
	};
	var newCampground={name: name,price: price,city: city,postcode:postcode,image: image,description:desc,author:author};
	
	//create new cg and save to db
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			res.redirect("/flats");
		}
	});
	
 });
//NEW - show form to create
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("flats/new");
	
});
//SHOW -  sow more infoabout one campground
router.get("/:id", function(req, res){
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
			if(err){
				console.log(err);
			} else{
				console.log(foundCampground);
				res.render("flats/show", {campground:foundCampground});
			}
		});
		
});
//edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){

		Campground.findById(req.params.id, function(err, foundCampground){
			
				res.render("flats/edit",{campground:foundCampground});
	
	    });
	});
//update campground route
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
	
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
		if (err){
			res.redirect("/flats");
		} else {
			res.redirect("/flats/"+req.params.id);
		}
	});
});

//destroy campgound route
router.delete("/:id" ,middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		
			if(err){
				res.redirect("/flats");
			} else {
				res.redirect("/flats");
			}
		
	});
});





module.exports = router;
