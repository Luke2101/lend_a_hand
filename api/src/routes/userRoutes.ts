import express from "express";
import UserService from "../services/UserService.js";
const router = express.Router();

router.post("/signup", UserService.signUp);
router.post("/signin", UserService.signIn);


export default router;