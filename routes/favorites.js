const express = require("express");
const favoriteController = require("../controllers/favorites.js");
const {isLoggedIn} = require("../middleware.js");

const router = express.Router({
    mergeParams: true
});

const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

router.post("/", isLoggedIn,wrapAsync(favoriteController.postFavorites));
    
module.exports = router;