const Listing = require('../models/listing');

module.exports.getCategoryListings = async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category: category }).populate('owner');
  res.render('listings/category.ejs', { listings, category });
};

