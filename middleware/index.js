const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const { StatusCode } = require("../utils/index");
const registerValidation = [
  check("email").isEmail().withMessage("Input field must not be empty"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Must be at least 5 chars long"),
];

const loginValidation = [
  check("email").isEmail().withMessage("Input field must not be empty"),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Must be at least 5 chars long"),
];

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, `secret`, async (err, decoded) => {
    if (err) res.status(StatusCode.NOT_FOUND);
    req.user = decoded;
    next();
  });
};

module.exports = {
  loginValidation,
  registerValidation,
  isAuthenticated
};
