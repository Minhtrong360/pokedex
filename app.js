require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
const { error } = require("console");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
console.log(__dirname);

app.use("/", indexRouter);

// // catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.send(error);
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.statusCode).send({ errors: { message: err.message } });
});

module.exports = app;
