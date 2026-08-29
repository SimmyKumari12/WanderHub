const Listing = require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must signup or login first!");
        // Request came from fetch()
        if (req.get("X-Requested-With") === "XMLHttpRequest") {
            return res.status(401).json({
                message: "You must signup or login first!"
            });
        }
        return res.redirect("/signup");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing doesn't exist!");
        return res.redirect("/listings");
    }

    if (!listing.owner) {
        req.flash("error", "This listing has no owner.");
        return res.redirect(`/listings/${id}`);
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You can't modify this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {

    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};