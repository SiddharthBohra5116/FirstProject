const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    fliename: String, 
  },
  price: Number,
  location: String,
  country: String,
  category: {
    type: String,
    enum : ["Rooms","Iconic Cities", "Mountains", "Castles", "Amazing Pools", "Camping", "Frams", "Arctic"]
  },
  reviews: [
    // this is the review schema which is in the listing one to few case
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type : [Number],
      required: true,
    },
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } }); // when listing is deleted then review also fo that listing should be deleted
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
