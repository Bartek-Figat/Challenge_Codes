const express = require("express");
const { loginUser, registerUser, userResources, saveChanges, deleteToken } = require("../services/index");
const {  isAuthenticated, isNotLoggedIn } = require("../middleware/index");
const {  loginValidation, registerValidation } = require("../validation/index");
const { Router } = express;
const router = Router();

router.get("/api/v1/user", isAuthenticated, userResources);

router.post("/api/v1/registration", registerValidation, registerUser);

router.post("/api/v1/login", loginValidation, loginUser);

router.put("/api/v1/update", isAuthenticated, saveChanges);

router.delete("/api/v1/logout", isNotLoggedIn, deleteToken);

module.exports = { router };
