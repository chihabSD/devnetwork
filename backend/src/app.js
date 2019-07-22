const express = require("express");
const connectDB = require("../config/db");
const logger = require("morgan");
const bodyParser = require("body-parser");

//use api v1
const v1 = require("./routes/v1.js");

const app = express();
connectDB(); // connect to database

app.use(logger("dev"));

//init body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/", v1); // any request fall under the prefix /ai/v2 go to v1 and deal with it

// go to process.env and get the mongo url
module.exports = app;
