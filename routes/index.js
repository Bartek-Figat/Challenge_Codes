const express = require("express");
const { loginUser, registerUser, userResources } = require("../services/index");
const {  loginValidation, registerValidation, isAuthenticated } = require("../middleware/index");
const { Router } = express;
const router = Router();

router.get("/user", isAuthenticated, userResources);

router.post("/registration", registerValidation, registerUser);

router.post("/login", loginValidation, loginUser);

router.put("/", isAuthenticated);

router.delete("/", isAuthenticated);

module.exports = { router };
