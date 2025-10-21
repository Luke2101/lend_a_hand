import express from "express";
import UserService from "../services/UserService.js";
import UserSerivce from "../services/UserService.js";
import {validateBody} from "../middleware/validate.js";
import {updateSchema} from "../schemas/userSchemas.js";
import {createRequestSchema} from "../schemas/requestSchemas.js";
import RequestService from "../services/RequestService.js";

const router = express.Router();

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new request
 *     description: Creates a new request entry for the authenticated user. The user must not exceed the maximum number of pending requests (5).
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []   # Assumes JWT or similar bearer authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequestBody'
 *     responses:
 *       201:
 *         description: Request successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Created Entry
 *       403:
 *         description: The user has reached the maximum number of pending requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_LIMIT_REACHED
 *       500:
 *         description: Internal server error while creating the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRequestBody:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - credits
 *         - description
 *         - from
 *         - to
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the request
 *           example: "Request for additional project credits"
 *         category:
 *           type: string
 *           description: Request category or type
 *           example: "Academic"
 *         credits:
 *           type: integer
 *           description: Number of credits requested
 *           example: 3
 *         description:
 *           type: string
 *           description: Detailed explanation of the request
 *           example: "Requesting 3 extra credits for the extended research project duration."
 *         from:
 *           type: string
 *           format: date-time
 *           description: Start date/time of the request period
 *           example: "2025-10-25T09:00:00Z"
 *         to:
 *           type: string
 *           format: date-time
 *           description: End date/time of the request period
 *           example: "2025-10-30T17:00:00Z"
 */

router.post("/create", validateBody(createRequestSchema), RequestService.createRequest);


export default router;