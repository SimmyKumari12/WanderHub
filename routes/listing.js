const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");
const {isLoggedIn,isOwner} = require("../middleware");
const listingController = require("../controllers/listing.js");
const ExpressError = require("../utils/ExpressError");
const upload = require("../config/multer");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(
            400,
            error.details[0].message
        );
    }
    next();
};

router.route("/").
get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.createListing)
)

//New Route
router.get("/new", isLoggedIn,listingController.newForm);

router.get("/favorites", isLoggedIn,wrapAsync(listingController.favourites));

// Category Route
router.get(
    "/category/:category",
    wrapAsync(listingController.categoryListings)
);

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

// Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.updateListing)
);

router.route("/:id")
.get(wrapAsync(listingController.getId))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))

module.exports = router;