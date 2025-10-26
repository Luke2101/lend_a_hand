import express, {type RequestHandler} from "express";
import FavouriteController from "../controllers/FavouriteController.js";
import {validateQuery} from "../middleware/validate.js";
import {updateRequestQuerySchema} from "../schemas/requestSchemas.js";

const router = express().router;


router.get("/", FavouriteController.get as RequestHandler)
router.delete("/", validateQuery(updateRequestQuerySchema),FavouriteController.remove as unknown as RequestHandler)
router.post("/", validateQuery(updateRequestQuerySchema),FavouriteController.add as unknown as any )


export default router;