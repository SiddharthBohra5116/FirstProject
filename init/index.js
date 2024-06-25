const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({}); // if there is any data in the db then clear it
  initData.data = initData.data.map((obj) => ({ 
    ...obj,
    owner: "667553d29b53f2bbb8086857" 
  }));
  await Listing.insertMany(initData.data); // then insert the new data
  console.log("data was initialized");
};

initDB();
