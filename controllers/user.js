const User = require("../models/user.js");


// SIGNUP PAGE
module.exports.signupForm = (req, res) => {
    res.render("users/signup");
};


// SIGNUP
module.exports.signup = async (req, res, next) => {

    try {

        const { username, email, password } = req.body;

        const user = new User({
            username,
            email
        });

        const registeredUser = await User.register(
            user,
            password
        );

        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash(
                "success",
                "Welcome to WanderHub!"
            );

            res.redirect(
                res.locals.redirectUrl || "/listings"
            );
        });

    } catch (e) {

        req.flash("error", e.message);

        res.redirect("/signup");
    }
};


// CHECK USERNAME
module.exports.checkUsername = async (req, res) => {

    const { username } = req.query;

    const user = await User.findOne({ username });

    if (user) {
        return res.json({
            available: false
        });
    }

    res.json({
        available: true
    });
};


// LOGIN PAGE
module.exports.loginForm = (req, res) => {
    res.render("users/login");
};


// LOGIN
module.exports.login = (req, res) => {

    req.flash(
        "success",
        "Welcome back to WanderHub!"
    );

    const redirectUrl =
        res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
};


// LOGOUT
module.exports.logout = (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You are logged out successfully!"
        );

        res.redirect("/listings");
    });
};