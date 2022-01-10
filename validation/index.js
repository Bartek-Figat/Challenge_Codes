const { check } = require("express-validator");

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

  module.exports = {
    loginValidation,
    registerValidation,
  };
  
  