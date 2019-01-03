const Campground= require("../models/campground");
const Comment= require("../models/comment");
const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById((req.params.id), (err, campground) => {
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }
            else {
                if (req.user._id.equals(campground.addedBy.id)) {
                    next();
                }
                else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }

            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById((req.params.id), (err, campground) => {
            if (err) {
                req.flash("error", "Campground not found.");
                res.redirect("back");
            }
            else {
                Comment.findById(req.params.comment_id, (err, comment) => {
                    if (err) {
                        res.redirect("back");
                    }
                    else {
                        if (req.user._id.equals(comment.author.id)) {
                            next();
                        }
                        else {
                            req.flash("error", "You don't have permission to do that.");
                            res.redirect("back");
                        }
                    }

                });

            }
        });
    }
    else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
};

module.exports = middlewareObj;