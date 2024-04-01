const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

//Homepage Router
router.get("/", async (req, res) => {
  let books;
  const author = await Author;
  try {
    books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec();
  } catch {
    books = [];
  }
  res.render("index", { author: author, books: books });
});

module.exports = router;
