const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const ExpressError = require("./utils/ExpressError");

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const favoriteRouter = require("./routes/favorites");
const userRouter = require("./routes/user.js");

const mongo_Url = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_Url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret : "mysecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
    },
}

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

app.use("/listings", listingRouter);

app.use("/listings/:listingId/reviews", reviewRouter);

app.use("/listings/:listingId/favorite", favoriteRouter);

app.use("/",userRouter);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


app.use((err, req, res, next) => {

    let {
        statusCode = 500,
        message = "Something went wrong"
    } = err;

    res.status(statusCode).render("error", {
        err: {
            statusCode,
            message
        }
    });

});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});