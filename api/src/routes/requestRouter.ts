import express from "express";
import UserService from "../services/UserService.js";
import UserSerivce from "../services/UserService.js";
import {validateBody} from "../middleware/validate.js";
import {updateSchema} from "../schemas/userSchemas.js";
import {createRequestSchema} from "../schemas/requestSchemas.js";
import RequestService from "../services/RequestService.js";

const router = express.Router();

router.post("/create", validateBody(createRequestSchema), RequestService.createRequest);

export default router;