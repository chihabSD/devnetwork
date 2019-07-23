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

//Any error happens go to (err in the next fundtion) and handle it
app.use((req, res, next) => {
  //create instance of error and give it a message
  var err = new Error("Page not found");
  err.status = 404; // error has property of 404
  next(err); // next handler
});

// handly any error here
app.use((err, req, res, next) => {
  // pass error status or interneral server error
  const status = err.status || 500;
  const error = err.message || "Error processing your request"; //err.message is coming from new Error object

  res.status(status).send({
    error
  });
});
// go to process.env and get the mongo url
module.exports = app;
