const express = require("express");
const router = express.Router({
    mergeParams: true
});
const reviewController = require("../controllers/review");
const {
    isLoggedIn,
    isReviewAuthor
} = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");


// VALIDATE REVIEW
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(
            400,
            error.details[0].message
        );
    }
    next();
};


// CREATE REVIEW
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);


// EDIT REVIEW PAGE
router.get(
    "/:reviewId/edit",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.editReviewForm)
);


// UPDATE AND DELETE REVIEW
router.route("/:reviewId")
    .put(
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(reviewController.updateReview)
    )
    .delete(
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(reviewController.deleteReview)
);

module.exports = router;