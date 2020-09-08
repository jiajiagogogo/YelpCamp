var express = require("express");
var router = express.Router({mergeParams: true}); 
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware/index");


//comment new
router.get("/new", middlewareObj.isLoggedIn, function(req, res){
	console.log(req.params.id);
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		res.render("comments/new", {campground: campground});
	});
});


//comments create
router.post("/", middlewareObj.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong");
					console.log(err);
				} else {
					//add username and id to comments
					comment.author.id = req.user._id;
					comment.author.username = req.user.username
					//save username and id to comments
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully add comment");
					res.redirect("/campgrounds/" + campground._id)
				} 
			})	
		}
	})
});

//comment edit
router.get("/:comment_id/edit",middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
		}
	})
})

//comment update
router.put("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" +req.params.id)
		}
	})
})

//comment destroy
router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted!");
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
})

module.exports = router; 