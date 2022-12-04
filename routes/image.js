var express = require("express");
var router = express.Router();
const fs = require("fs");
const csv = require("csvtojson");

/* GET home page. */

router.get("/", function (req, res, next) {
  res.send("OK image");
});

router.get("/:id", async (req, res, next) => {
  res.send("OK image 2");
});

module.exports = router;
