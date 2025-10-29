import express, { type RequestHandler } from "express";
import FavouriteController from "../controllers/FavouriteController.js";
import { validateQuery } from "../middleware/validate.js";
import { updateRequestQuerySchema } from "../schemas/requestSchemas.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Favourites
 *   description: Manage user favourite requests
 */

/**
 * @swagger
 * /favourites:
 *   get:
 *     summary: Get all favourite requests of the authenticated user
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favourite request IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: integer
 *                 example: 42
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: INTERNAL_SERVER_ERROR
 */
router.get("/", FavouriteController.get as RequestHandler);

/**
 * @swagger
 * /favourites:
 *   post:
 *     summary: Add a request to the user's favourites
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 42
 *         description: The ID of the request to add to favourites
 *     responses:
 *       201:
 *         description: Request successfully added to favourites
 *       403:
 *         description: Cant be interested in own requests
 *       409:
 *         description: Request is already in favourites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ALREADY_IN_FAVOURITES
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    validateQuery(updateRequestQuerySchema),
    FavouriteController.add as unknown as RequestHandler
);

/**
 * @swagger
 * /favourites:
 *   delete:
 *     summary: Remove a request from the user's favourites
 *     tags: [Favourites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 42
 *         description: The ID of the request to remove from favourites
 *     responses:
 *       200:
 *         description: Request successfully removed from favourites
 *       404:
 *         description: Request not found in favourites
 *       500:
 *         description: Internal server error
 */
router.delete("/", validateQuery(updateRequestQuerySchema), FavouriteController.remove as unknown as RequestHandler);

export default router;
