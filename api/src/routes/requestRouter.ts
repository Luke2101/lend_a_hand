import express from "express";
import UserService from "../services/UserService.js";
import UserSerivce from "../services/UserService.js";
import {validateBody} from "../middleware/validate.js";
import {updateSchema} from "../schemas/userSchemas.js";
import {createRequestSchema, deleteRequestSchema} from "../schemas/requestSchemas.js";
import RequestService from "../services/RequestService.js";

const router = express.Router();

/**
 * @swagger
 * /request/create:
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
 *               $ref: '#/components/schemas/RequestResponse'
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
 *           description: Detailed explanation of the request (optional)
 *           example: "Requesting 3 extra credits for the extended research project duration."
 *         from:
 *           type: string
 *           format: date-time
 *           description: Start date/time of the request period (optional)
 *           example: "2025-10-25T09:00:00Z"
 *         to:
 *           type: string
 *           format: date-time
 *           description: End date/time of the request period (optional)
 *           example: "2025-10-30T17:00:00Z"
 *
 *     RequestResponse:
 *       type: object
 *       description: The created request entry
 *       properties:
 *         id:
 *           type: number
 *           description: Unique ID of the created request
 *           example: 42
 *         title:
 *           type: string
 *           example: "Request for additional project credits"
 *         category:
 *           type: string
 *           example: "Academic"
 *         credits:
 *           type: integer
 *           example: 3
 *         description:
 *           type: string
 *           example: "Requesting 3 extra credits for the extended research project duration."
 *         from:
 *           type: string
 *           format: date-time
 *           example: "2025-10-25T09:00:00Z"
 *         to:
 *           type: string
 *           format: date-time
 *           example: "2025-10-30T17:00:00Z"
 *         status:
 *           type: string
 *           description: Current request status
 *           example: "pending"
 */

router.post("/create", validateBody(createRequestSchema), RequestService.createRequest);
/**
 * @swagger
 * /request/remove:
 *   delete:
 *     summary: Delete an existing request
 *     description: Deletes a request created by the authenticated user. The user can only delete requests they originally created.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []   # Assumes JWT or similar bearer authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteRequestBody'
 *     responses:
 *       204:
 *         description: Request successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: DELETED
 *       403:
 *         description: The authenticated user did not create this request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_CREATOR_TOKEN_MISMATCH
 *       500:
 *         description: Internal server error while deleting the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ERROR_DURING_DELETION
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     DeleteRequestBody:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the request to delete
 *           example: 42
 */

router.delete("/remove", validateBody(deleteRequestSchema), RequestService.deleteRequest);


export default router;