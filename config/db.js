const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/web-scraper", {});
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// jalamdangi96 
// 59fARtmrbviA86g8

// mongodb+srv://jalamdangi96:59fARtmrbviA86g8@cluster0.hlvru.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://jalamdangi96:59fARtmrbviA86g8@cluster0.hlvru.mongodb.net/