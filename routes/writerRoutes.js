const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const writerModel = require("../model/writerModel");
const router = express.Router();
const SECRET = require("../env");

// create individual writers
router.post("/", async function(req, res) {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const writer = await writerModel.create(req.body);
    const result = writer.toJSON();
    delete result.password;
    const token = jwt.sign({ id: writer.id }, SECRET.Secret, {
      expiresIn: "1h"
    });

    res.status(200).json({
      status: "success",
      data: { writer: result, token }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statsu: "error",
      message: "An error occured while creating your account"
    });
  }
});

// Get a writer profile
router.get("/profile", async function(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json({ status: "error", message: "please specify an header" });
    const token = authHeader.split(" ")[1];
    const tokenData = jwt.verify(token, SECRET.Secret);
    const writer = await writerModel.findById(tokenData.id);
    res.json({ status: "sucess", writer });
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "error", message: error.message });
  }
});

// login a writer
router.post("/login", async function(req, res) {
  try {
    const writer = await writerModel.findOne(
      { email: req.body.email },
      "+password"
    );

    if (!writer) {
      return res
        .status(401)
        .json({ status: "error", message: "Writer does not exist" });
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      writer.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid Password" });
    }
    const token = jwt.sign({ id: writer.id }, SECRET.Secret);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({status: "error", message:error})
  }
});

// update writer data
router.put("/:email", async function(req, res) {
  try {
    const updatedWriter = await writerModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true }
    );

    // check if the writer was found and updated
    if (!updatedWriter) {
      res.status(404).json({
        status: "error",
        message: "Sorry that writer does not exist"
      });
    }
    res.json({
      status: "success",
      updatedWriter
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statsu: "error",
      message: "An error occured while updating the writer account"
    });
  }
});

// delete a writer
router.delete("/:email", async function(req, res) {
  try {
    const deletedWriter = writerModel.findOneAndDelete({
      first_name: req.params.email
    });
    if (!deletedWriter) {
      res.status(404).json({
        status: "error",
        message: "Sorry you can not delete a writer that does not exit"
      });
      return;
    }
    res.json({
      status: "success",
      message: "Successfully deleted the writer"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statsu: "error",
      message: "An error occured while deleting the writer account"
    });
  }
});

// get writer by email
router.get("/:email", async function(req, res) {
  const writer = await writerModel.findOne({ email: req.params.email });
  if (!writer) {
    res.status(404).json({
      status: "error",
      message: "The writer was not found"
    });
    return;
  }

  try {
    res.json({
      status: "success",
      writer
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: error,
      message: "An error occured while getting the writer"
    });
  }
});

// get list of all writers
router.get("/", async function(req, res) {
  try {
    const search = req.query.gender ? { gender: req.query.gender } : {};
    const writers = await writerModel.find(search);
    res.json({
      status: "success",
      writers
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "An error occured while getting all writers"
    });
  }
});

module.exports = router;
