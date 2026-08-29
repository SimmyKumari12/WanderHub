require("dotenv").config();

const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing.js");

const mongo_Url = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to MongoDB Atlas");
        initDB();
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_Url);
}

const initDB = async () => {
    await Listing.deleteMany({});

    const listings = initdata.data.map((listing) => ({
        ...listing,
        owner: "6a80b9d5722c04e0da7e261b"
    }));

    await Listing.insertMany(listings);

    console.log("Data was initialized");
    await mongoose.connection.close();
};