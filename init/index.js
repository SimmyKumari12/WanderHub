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
        owner: "6a9341ac1879e145a0bcd4fb"
    }));

    await Listing.insertMany(listings);

    console.log("Data was initialized");
    await mongoose.connection.close();
};