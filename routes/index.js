const express = require("express");
const { loginUser, registerUser, userResources } = require("../services/index");
const {  isAuthenticated } = require("../middleware/index");
const {  loginValidation, registerValidation } = require("../validation/index");
const { Router } = express;
const router = Router();

router.get("/api/v1/user", isAuthenticated, userResources);

router.post("/api/v1/registration", registerValidation, registerUser);

router.post("/api/v1/login", loginValidation, loginUser);

router.put("/api/v1/", isAuthenticated);

router.delete("/api/v1/", isAuthenticated);

module.exports = { router };
