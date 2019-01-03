const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById((req.params.id), (err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/new", {
                campground: foundCampground
            });
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById((req.params.id), (err, foundCampground) => {
        if (err) {
            console.log(err);
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            })
        }
    });
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership, (req, res) => {
    Campground.findById((req.params.id), (err, campground) => {
        Comment.findById((req.params.comment_id), (err, comment) => {
            res.render("comments/edit", {
                campground: campground,
                comment: comment
            });
        });
    });
});

router.put("/:comment_id",middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id,{
        text: req.body.comment.text
},
    (err, comment) => {
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds")
        }
    });
});

router.delete("/:comment_id",middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id,
        (err) => {
            if(err){
                console.log(err);
            }
            else
            {
                res.redirect("/campgrounds")
            }
        });
});

module.exports = router;