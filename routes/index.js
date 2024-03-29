const express = require("express");
const router = express.Router();

//Homepage Router
router.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
