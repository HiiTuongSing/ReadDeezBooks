const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Book = require("../models/book");

//Authors Router
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find({});
    res.render("authors/index", {
      authors: authors,
      deleteConfirm: req.query.deleteConfirm,
    });
  } catch (err) {
    console.error(err);
  }
});

//New author create page
router.get("/new", async (req, res) => {
  try {
    res.render("authors/new.ejs", { author: new Author() });
  } catch (err) {
    console.error(err);
  }
});

router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error creating author...",
    });
    console.error(err);
  }
});

//Display author
router.get("/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  const books = await Book.find({ author: req.params.id });
  try {
    res.render("authors/show", {
      author: author,
      books: books,
      deleteConfirm: req.query.deleteConfirm,
    });
  } catch (err) {
    res.redirect("/");
    console.error(err);
  }
});

//Delete author
router.delete("/:id", async (req, res) => {
  const books = await Book.find({ author: req.params.id });
  try {
    if (books.length > 0) {
      throw new Error("Unable to delete author with books");
    }
    await Author.findByIdAndDelete(req.params.id);
    res.redirect("/authors");
  } catch (err) {
    let author = await Author.findById(req.params.id);
    res.render("authors/show", {
      author: author,
      books: books,
      deleteConfirm: req.query.deleteConfirm,
      errorMessage: err,
    });
    console.error(err);
  }
});

//Edit author
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", {
      author: author,
    });
  } catch (err) {
    res.redirect("/");
    console.error(err);
  }
});

router.put("/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  try {
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        author: author,
        errorMessage: "Error updating author...",
      });
    }
  }
});

module.exports = router;
