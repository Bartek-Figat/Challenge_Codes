import {Request, Response, NextFunction, Router } from "express";
import{  loginUser, registerUser, userResources, saveChanges, deleteToken } from "../services/index";
import {  isAuthenticated } from "../middleware/index";
import {  loginValidation, registerValidation } from "../validation/index";
const router = Router();

interface CustomRequest extends Request {
    user: {
        generateAccessToken: string
    };
  }


router.get("/api/v1/user", isAuthenticated, userResources);

router.post("/api/v1/registration", registerValidation, registerUser);

router.post("/api/v1/login", loginValidation, loginUser);

router.put("/api/v1/update", isAuthenticated, saveChanges);

router.delete("/api/v1/logout", deleteToken);

export default router;
