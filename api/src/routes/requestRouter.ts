import express from "express";
import UserService from "../services/UserService.js";
import UserSerivce from "../services/UserService.js";
import {validateBody} from "../middleware/validate.js";
import {updateSchema} from "../schemas/userSchemas.js";

const router = express.Router();

router.patch("/update", validateBody(updateSchema), UserService.updateProfile);

export default router;