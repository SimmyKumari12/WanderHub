const Listing = require("../models/listing");
const Review = require("../models/review");


// CREATE REVIEW
module.exports.createReview = async (req, res) => {

    const listing = await Listing.findById(req.params.listingId);

    const newReview = new Review({
        comment: req.body.comment,
        rating: req.body.rating
    });

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Review added successfully!");

    res.redirect(`/listings/${listing._id}`);
};


// EDIT REVIEW PAGE
module.exports.editReviewForm = async (req, res) => {

    const { listingId, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    const listing = await Listing.findById(listingId);

    res.render("reviews/edit", {
        review,
        listing
    });
};


// UPDATE REVIEW
module.exports.updateReview = async (req, res) => {

    const { listingId, reviewId } = req.params;

    await Review.findByIdAndUpdate(
        reviewId,
        {
            comment: req.body.comment,
            rating: req.body.rating
        }
    );

    req.flash("success", "Review updated!");

    res.redirect(`/listings/${listingId}`);
};


// DELETE REVIEW
module.exports.deleteReview = async (req, res) => {

    const { listingId, reviewId } = req.params;

    await Review.findByIdAndDelete(reviewId);

    await Listing.findByIdAndUpdate(
        listingId,
        {
            $pull: {
                reviews: reviewId
            }
        }
    );

    req.flash("success", "Review deleted!");

    res.redirect(`/listings/${listingId}`);
};