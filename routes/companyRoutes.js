const express = require("express");
const router = express.Router();
const Company = require("../models/Company");
const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

// Scrape and Save Company Data
router.post("/scrape", async (req, res) => {
  const { url } = req.body;
  try {
    // Fetch HTML data using axios
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Scrape company details
    const name = $("meta[property='og:site_name']").attr("content") || $("title").text() || "";
    const description = $("meta[name='description']").attr("content") || "";
    const logo = $("meta[property='og:image']").attr("content") || "";
    const facebook = $("a[href*='facebook.com']").attr("href") || "";
    const linkedin = $("a[href*='linkedin.com']").attr("href") || "";
    const twitter = $("a[href*='twitter.com']").attr("href") || "";
    const instagram = $("a[href*='instagram.com']").attr("href") || "";

    // Extracting address, phone, and email (if available on the page)
    const address = $("address").text().trim() || "";
    const phone = $("a[href^='tel:']").attr("href")?.replace("tel:", "") || "";
    const email = $("a[href^='mailto:']").attr("href")?.replace("mailto:", "") || "";

    // Puppeteer for Screenshot
    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    const screenshot = await page.screenshot({ encoding: "base64" }); // Save screenshot as Base64
    await browser.close();

    // Save to DB
    const company = new Company({
      name,
      description,
      logo,
      facebook,
      linkedin,
      twitter,
      instagram,
      address,
      phone,
      email,
      screenshot, // Save Base64 screenshot to the database
    });
    await company.save();

    res.json(company);
  } catch (err) {
    console.error("Error scraping company data:", err.message);
    res.status(500).json({ error: "Failed to scrape company data. Please try again." });
  }
});

// Fetch All Companies
router.get("/", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error("Error fetching companies:", err.message);
    res.status(500).json({ error: "Failed to fetch companies." });
  }
});

// Get Single Company Details
router.get("/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }
    res.json(company);
  } catch (err) {
    console.error("Error fetching company details:", err.message);
    res.status(500).json({ error: "Failed to fetch company details." });
  }
});

// Route to delete selected companies
router.post("/delete", async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No valid IDs provided for deletion." });
  }

  try {
    // Delete companies with IDs present in the request body
    const result = await Company.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Companies deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting companies:", error.message);
    res.status(500).json({ error: "An error occurred while deleting companies." });
  }
});

module.exports = router;
