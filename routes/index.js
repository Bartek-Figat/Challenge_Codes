const express = require("express");
const { check } = require("express-validator");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { UserRepository } = require("../repositories/index");
const { loginUser, registerUser } = require("../services/index");
const { Router } = express;
const router = Router();

// GET method route
router.get("/user", async (req, res) => {
  const token = req.headers.authorization;
  jwt.verify(token, `secret`, async (err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      const user = await UserRepository.findOne({
        _id: ObjectId(decoded.accessToken),
      });
      res.json({ user });
    }
  });
});

// POST method route
// Input field must not be empty
router.post(
  "/registration",
  check("email").isEmail().withMessage("Input field must not be empty"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Must be at least 5 chars long"),
  async (req, res) => registerUser(req, res)
);

router.post(
  "/login",
  check("email").isEmail().withMessage("Input field must not be empty"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Must be at least 5 chars long"),
  async (req, res) => loginUser(req, res)
);

// PUT method route
router.put("/", async (req, res) => {
  res.send("POST request to the homepage");
});

// DELETE method route
router.delete("/", async (req, res) => {
  res.send("POST request to the homepage");
});

module.exports = { router };
