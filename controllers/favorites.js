const Listing = require("../models/listing");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

module.exports.postFavorites = async (req, res) => {

    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    const user = await User.findById(req.user._id);

    const index = user.favorites.indexOf(listing._id);

    let isFavorite;

    if (index === -1) {
        // Add to favorites
        user.favorites.push(listing._id);
        isFavorite = true;
    } else {
        // Remove from favorites
        user.favorites.splice(index, 1);
        isFavorite = false;
    }

    await user.save();

    res.json({
        isFavorite
    });
}