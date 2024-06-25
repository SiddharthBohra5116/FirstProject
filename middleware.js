const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");  //Importing a schema for validating listing data
const ExpressError = require("./utils/ExpressError.js");  // Importing a custom error handler

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to perform this action!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Middleware for validating listing data
module.exports.validateListing = (req, res, next) => {
  // Validating the request body against the listing schema
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // If there's an error, create an error message
    let errMsg = error.details.map((el) => el.message).join(",");
    // Throw an ExpressError with a status code of 400 (Bad Request) and the error message
    throw new ExpressError(400, errMsg);
  } else {
    // If validation passes, proceed to the next middleware or route handler
    next();
  }
};


module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor= async (req, res, next) => {
  let { id, reviewId } = req.params;
  let listing = await Review.findById(reviewId);
  if (!listing.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You did not created this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};