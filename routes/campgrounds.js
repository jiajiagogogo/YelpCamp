var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var middlewareObj = require("../middleware/index");

//index route show all campgrounds
router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campground: allCampgrounds, currentUser: req.user});
		}
	})
});
	
//create - add new campground to DB
router.post("/", middlewareObj.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id : req.user._id,
		username: req.user.username
	}
	var newCampgrounds = {name: name, image: image, description: desc, author: author}
	Campground.create(newCampgrounds, function(err, newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds")
		}
	});	
})

//new - show form to create new campground
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
	res.render("campgrounds/new")
})

//show - shows more info about one campground
router.get("/:id", function(req, res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground)
			res.render("campgrounds/show", {campground: foundCampground})
		}
	});
});

//EDIT CAMPGROUNDS ROUTE
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground})
	});
});
//UPDATE CAMPGROUNDS ROUTE
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id )
		}
	});
});

//DESTROY CAMPGROUNDS ROUTE
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds")
		}
	});
});

//middleware


 
module.exports = router; 