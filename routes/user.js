const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const {
    saveRedirectUrl
} = require("../middleware");
const userController = require("../controllers/user");

//Signup Page
router.route("/signup")
.get(
    userController.signupForm
).post(
    saveRedirectUrl,
    wrapAsync(userController.signup)
);

// CHECK USERNAME
router.get(
    "/check-username",
    wrapAsync(userController.checkUsername)
);


// LOGIN PAGE
router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,

    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),

    userController.login
);

// LOGOUT
router.get(
    "/logout",
    userController.logout
);

module.exports = router;