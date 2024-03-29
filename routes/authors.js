const express = require("express");
const router = express.Router();
const Author = require("../models/author");

//Authors Router
router.get("/", async (req, res) => {
  try {
    const authors = await Author.find({});
    res.render("authors/index", { authors: authors });
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
  try {
    res.render("authors/show", {
      author: author,
    });
  } catch (err) {
    res.redirect("/");
    console.error(err);
  }
});

//Delete author
router.delete("/:id", async (req, res) => {
  try {
    await Author.findByIdAndDelete(req.params.id);
    res.redirect("/authors");
  } catch (err) {
    res.render("/:id", {
      errorMessage: "Error deleting author...",
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
