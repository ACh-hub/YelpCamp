const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

router.get("/", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: campgrounds
            });
        }
    });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.sanitize(req.body.name);
    const image = req.sanitize(req.body.image);
    const description = req.sanitize(req.body.description);
    const price = req.sanitize(req.body.price);
    const addedBy = {
        id: req.user._id,
        username: req.user.username
    };

    const newCamp = {
        name: name,
        image: image,
        description: description,
        price: price,
        addedBy: addedBy
    };

    Campground.create(newCamp, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});


router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {
                campground: campground
            });
        }
    })
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById((req.params.id), (err, campground) => {
        res.render("campgrounds/edit", {
            campground: campground
        });
    });
});

router.put("/:id",middleware.checkCampgroundOwnership, (req, res) => {

    Campground.findByIdAndUpdate(req.params.id, {
        name: req.sanitize(req.body.name),
        image: req.body.image,
        description: req.sanitize(req.body.description)
    }, (err, campground) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds/" + campground._id);
        }

    });
});

router.delete("/:id",middleware.checkCampgroundOwnership, (req, res) => {

    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }

    });
});

module.exports = router;