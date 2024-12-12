const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/companyRoutes");
const path = require("path");

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder for screenshots
app.use("/screenshots", express.static(path.join(__dirname, "screenshots")));

// Routes
app.get("/", (req, res) => res.send("Welcome to the web scraper server!"));
app.use("/api/companies", companyRoutes);

// Export the app for Vercel to use
module.exports = app;
