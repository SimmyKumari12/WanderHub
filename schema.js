const Joi = require("joi");

const listingSchema = Joi.object({
    title: Joi.string().required(),

    description: Joi.string().required(),

    image: Joi.string().uri().allow("", null),

    price: Joi.number().required().min(0),

    location: Joi.string().required(),

    country: Joi.string().required(),

     category: Joi.string()
        .valid(
            "Farms",
            "Rooms",
            "Mountains",
            "Beaches",
            "Deserts",
            "Cities",
            "Islands",
            "Camping"
        )
        .required()
});

const reviewSchema = Joi.object({
    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required(),

    comment: Joi.string()
        .trim()
        .min(5)
        .max(500)
        .required()
});

module.exports = {
    listingSchema,
    reviewSchema
};