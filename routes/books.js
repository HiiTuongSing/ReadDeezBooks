const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

//Books Router with a Search Query
router.get("/", async (req, res) => {
  let query = Book.find();

  if (req.query.title != null && req.query.title !== "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  } else if (
    req.query.publishedBefore != null &&
    req.query.publishedBefore !== ""
  ) {
    query = query.lte("publishDate", req.query.publishedBefore);
  } else if (
    req.query.publishedAfter != null &&
    req.query.publishedAfter !== ""
  ) {
    query = query.gte("publishDate", req.query.publishedAfter);
  }
  let books = await query;
  try {
    res.render("books/index", {
      books: books,
      reqQuery: req.query,
      deleteConfirm: req.query.deleteConfirm,
    });
  } catch (err) {
    console.error(err);
  }
});

//New Book
router.get("/new", async (req, res) => {
  try {
    const authors = await Author.find({});
    const book = new Book();
    res.render("books/new.ejs", {
      authors: authors,
      book: book,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/", async (req, res) => {
  const authors = await Author.find({});
  let book;

  try {
    book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      description: req.body.description,
    });

    if (req.body.cover != null && req.body.cover !== "") {
      saveCover(book, req.body.cover);
    }

    await book.save();
    const author = await Author.findById(book.author);
    res.render("books/show", {
      author: author,
      book: book,
      deleteConfirm: req.query.deleteConfirm,
    });
  } catch (err) {
    if (req.body.author == "Create an author first...") {
      res.redirect("/authors/new");
    }
    console.error(err);
    res.render("books/new", {
      authors: authors,
      book: book,
      errorMessage: "Please fill out all the section with * before saving...",
    });
  }
});

function saveCover(book, encodedCover) {
  if (encodedCover == null) return;
  let cover = JSON.parse(encodedCover);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImageBuffer = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
}

//Show Book
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  const author = await Author.findById(book.author);

  try {
    res.render("books/show", {
      author: author,
      book: book,
      deleteConfirm: req.query.deleteConfirm,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

//Edit Book
router.get("/:id/edit", async (req, res) => {
  const book = await Book.findById(req.params.id);
  const authors = await Author.find({});
  const author = await Author.findById(book.author);
  try {
    res.render("books/edit", { book: book, authors: authors, author: author });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

router.put("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  let author = await Author.findById(book.author);
  const authors = await Author.find({});
  try {
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = req.body.publishDate;
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    await book.save();
    author = await Author.findById(book.author);
    res.render("books/show", {
      book: book,
      author: author,
      deleteConfirm: req.query.deleteConfirm,
    });
  } catch {
    res.render("books/edit", {
      authors: authors,
      author: author,
      book: book,
      errorMessage: "Please fill out all the section with * before saving...",
    });
  }
});

//Delete Book
router.delete("/:id", async (req, res) => {
  let book;
  const books = await Book.find({});
  try {
    book = await Book.findByIdAndDelete(req.params.id);
    res.redirect("/books");
  } catch (err) {
    console.error(err);
    res.render("books/index", {
      books: books,
      errorMessage: "Error deleting book...",
    });
  }
});

module.exports = router;
