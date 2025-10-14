import express from "express";
import AuthService from "../services/AuthService.js";
import {validateBody} from "../middleware/validate.js";
import {signInSchema, signUpSchema} from "../schemas/authSchemas.js";
const router = express.Router();

router.post("/signup", validateBody(signUpSchema), AuthService.signUp);
router.post("/login", validateBody(signInSchema),AuthService.signIn);


export default router;