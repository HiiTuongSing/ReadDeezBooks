//Setting up MongoDB
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to MongoDB"));

//Requiring Dependencies
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

//Setting up Middlewares
app.use(expressLayouts);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(methodOverride("_method"));

//Settings for server
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");

//Setting up Routes(Controller)
const indexRouter = require("./routes/index");
const authorsRouter = require("./routes/authors");
const booksRouter = require("./routes/books");

app.use("/", indexRouter);
app.use("/authors", authorsRouter);
app.use("/books", booksRouter);

//Setting up port
app.listen(process.env.PORT || 3000);
