import express from "express";
import AuthService from "../services/AuthService.js";
import {validateBody} from "../middleware/validate.js";
import {signInSchema, signUpSchema} from "../schemas/authSchemas.js";
import {authenticateUser} from "../middleware/auth.js";
import UserService from "../services/UserService.js";
const router = express.Router();

router.post("/info", UserService.getAccountInfo);
router.post("/logout", UserService.logout);

export default router;