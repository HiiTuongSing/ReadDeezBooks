const express = require("express");
const router = express.Router();

//Books Router
router.get("/", async (req, res) => {
  try {
    res.render("books/index");
  } catch (err) {
    console.error(err);
  }
});

//New Book
router.get("/new", async (req, res) => {
  try {
    res.render("books/new.ejs");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
