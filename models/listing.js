const validator = require("validator");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title:{
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1728485859036-673696426dc6?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D",
        set: (v) =>
            v === ""
                ? "https://images.unsplash.com/photo-1728485859036-673696426dc6?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJlYWNoJTIwaW1hZ2V8ZW58MHx8MHx8fDA%3D"
                : v,
        validate: {
            validator: function (v) {
                return validator.isURL(v, {
                    protocols: ["http", "https"],
                    require_protocol: true,
                });
            },
            message: "Please enter a valid image URL.",
        },
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    geometry: {
        lat: Number,
        lng: Number
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
    type: String,
    enum: [
        "Farms",
        "Rooms",
        "Mountains",
        "Beaches",
        "Deserts",
        "Cities",
        "Islands",
        "Camping"
    ],
    required: true
    }
});

listingSchema.post("findOneAndDelete",async (listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;

