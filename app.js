if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express"); // Requiring the express package
const app = express(); // Creating an instance of express
const mongoose = require("mongoose"); // Requiring the mongoose package
const path = require("path"); // Requiring the path module
const methodOverride = require("method-override"); // Requiring method-override to support PUT and DELETE requests
const ejsMate = require("ejs-mate"); // Requiring ejs-mate for EJS layout templates
const ExpressError = require("./utils/ExpressError.js"); // Requiring a custom error handling module
const session = require("express-session"); // Requiring express-session for session management
const MongoStore = require("connect-mongo");
const flash = require("connect-flash"); // Requiring connect-flash for flash messages
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js"); // Requiring the listings routes
const reviewRouter = require("./routes/review.js"); // Requiring the reviews routes
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL
// Connecting to MongoDB
async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Setting up the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded data
app.use(methodOverride("_method")); // Method override for PUT and DELETE requests
app.engine("ejs", ejsMate); // Setting ejsMate as the template engine
app.use(express.static(path.join(__dirname, "/public"))); // Serving static files from the public directory

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE",error)
})

// Session and flash message configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass flash messages to all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Listings and reviews routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Catch-all route for 404 errors
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page doesn't Found!"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  //res.status(statusCode).send(message);
});

// Start the server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
