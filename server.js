const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const writerRoute = require("./routes/writerRoutes");

// connect to mongoDB
mongoose
  .connect("mongodb://localhost:27017/levelup-blog")
  .then(_ => {
    console.log("successfully connected to momgodb ");
  })
  .catch(err => {
    console.log(`An error occured while connecting to mongodb ${err}`);
  });

app.use(cors());

// add middleware for parsing json and url encoded data and populating req body
app.use(express.urlencoded({ extende: false }));
app.use(express.json());

app.use("/writer", writerRoute);

app.listen(3030).on("listening", () => {
  console.log(`we are live on port 3030`);
});
