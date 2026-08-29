const Listing = require("../models/listing");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const cloudinary = require("../cloudConfig");
const streamifier = require("streamifier");

module.exports.createListing = async (req, res) => {
    if (!req.file) {
        req.flash("error", "Please upload an image!");
        return res.redirect("/listings/new");
    }

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "WanderHub" },
        async (error, result) => {

            if (error) {
                req.flash("error", "Image upload failed!");
                return res.redirect("/listings/new");
            }

            const listing = new Listing(req.body);
            console.log(listing);

            listing.image = result.secure_url;
            listing.owner = req.user._id;

            const address = `${listing.location}, ${listing.country}`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
                {
                    headers: {
                        "User-Agent": "WanderHub"
                    }
                }
            );

            const data = await response.json();
            if(data.length > 0){
                listing.geometry = {
                    lat : Number(data[0].lat),
                    lng : Number(data[0].lon)
                };
            }
            await listing.save();

            req.flash("success", "New listing created!");
            res.redirect(`/listings/${listing._id}`);
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports.index = async (req, res) => {

    const { location, category } = req.query;

    let filter = {};

    // Search by location
    if (location && location.trim() !== "") {
        filter.location = {
            $regex: location.trim(),
            $options: "i"
        };
    }

    // Search by category
    if (category && category.trim() !== "") {
        filter.category = {
            $regex: category.trim(),
            $options: "i"
        };
    }

    const allListings = await Listing.find(filter);

    res.render("index", {
        allListings,
        activeCategory: "All Homes"
    });
};

module.exports.categoryListings = async(req,res) => {
    const {category} = req.params;

    const listings = await Listing.find({
        category : category
    });

    res.render("category",{
        listings,category,activeCategory : category
    });
}
module.exports.newForm = (req, res) => {
    res.render("new");
}

module.exports.favourites = async (req, res) => {
    const user = await User.findById(req.user._id).populate("favorites");
    const favListings = user.favorites;

    res.render("favorites",{
        favListings
    });
}

module.exports.editForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let originalImg = listing.image;
    originalImg = originalImg.replace("/upload","/upload/h_300,w_250");
    res.render("edit", { listing , originalImg});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    listing.title = req.body.title;
    listing.description = req.body.description;
    listing.price = req.body.price;
    listing.location = req.body.location;
    listing.country = req.body.country;
    listing.category = req.body.category;

    const address = `${listing.location}, ${listing.country}`;

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
        {
            headers: {
                "User-Agent": "WanderHub"
            }
        }
    );

    const data = await response.json();

    if (data.length > 0) {
        listing.geometry = {
            lat: Number(data[0].lat),
            lng: Number(data[0].lon)
        };
    }

    // If a new image was selected
    if (req.file) {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "WanderHub" },
            async (error, result) => {

                if (error) {
                    req.flash("error", "Image upload failed!");
                    return res.redirect(`/listings/${id}/edit`);
                }

                listing.image = result.secure_url;

                await listing.save();

                req.flash("success", "Listing updated successfully!");
                res.redirect(`/listings/${id}`);
            }
        );

        streamifier
            .createReadStream(req.file.buffer)
            .pipe(uploadStream);

    } else {
        // No new image selected
        await listing.save();

        req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
    }
};

module.exports.getId = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing
        .findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing which you requested for doesn't exist!");
        return res.redirect("/listings");
    }

    res.render("show", { listing });

}

module.exports.deleteListing = async (req, res) => {

    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError(
            404,
            "Listing not found"
        );
    }

    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted!");
    res.redirect("/listings");
}