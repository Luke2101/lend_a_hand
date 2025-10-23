import express from "express";
import UserService from "../services/UserService.js";
import UserSerivce from "../services/UserService.js";
import {validateBody, validateQuery} from "../middleware/validate.js";
import {updateSchema} from "../schemas/userSchemas.js";
import {
    createRequestSchema,
    deleteRequestSchema,
    type UpdateQueryParams,
    updateRequestQuerySchema
} from "../schemas/requestSchemas.js";
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

/**
 * @swagger
 * /request/update:
 *   patch:
 *     summary: Update an existing request
 *     description: Updates an existing request created by the authenticated user. Only the request creator can update it.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 42
 *         description: The ID of the request to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRequestBody'
 *     responses:
 *       200:
 *         description: Request successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_UPDATED
 *       400:
 *         description: The specified request was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_NOT_FOUND
 *       403:
 *         description: The request does not belong to the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_CREATOR_TOKEN_MISMATCH
 *       500:
 *         description: Internal server error during update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: UNABLE_TO_UPDATE_REQUEST
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRequestBody:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - credits
 *       properties:
 *         title:
 *           type: string
 *           description: Updated title of the request
 *           example: "Revised project credits request"
 *         category:
 *           type: string
 *           description: Updated request category
 *           example: "Academic"
 *         credits:
 *           type: integer
 *           description: Updated number of requested credits
 *           example: 4
 *         description:
 *           type: string
 *           description: Optional detailed description
 *           example: "Updated reason for credit request."
 *         from:
 *           type: string
 *           format: date-time
 *           description: Optional start time for the request
 *           example: "2025-10-25T09:00:00Z"
 *         to:
 *           type: string
 *           format: date-time
 *           description: Optional end time for the request
 *           example: "2025-10-30T17:00:00Z"
 */

router.patch("/update", validateBody(createRequestSchema), validateQuery(updateRequestQuerySchema),RequestService.updateRequest as any)

/**
 * @swagger
 * /request/accept:
 *   patch:
 *     summary: Accept a request
 *     description: Allows an authenticated user to accept a pending request. A user cannot accept their own requests or those already assigned.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 25
 *         description: The ID of the request to accept.
 *     responses:
 *       200:
 *         description: Request successfully accepted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_ACCEPTED
 *                 id:
 *                   type: integer
 *                   example: 25
 *       400:
 *         description: Request not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_NOT_FOUND
 *       403:
 *         description: User cannot accept own request or request is already assigned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_ALREADY_ASSIGNED
 *       500:
 *         description: Internal server error during acceptance process.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INTERNAL_SERVER_ERROR
 */

router.patch("/accept", validateQuery(updateRequestQuerySchema), RequestService.acceptRequest as any)

/**
 * @swagger
 * /request/info:
 *   get:
 *     summary: Get detailed information about a specific request
 *     description: Returns the full request object for a given request ID. The request must exist.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *         description: The ID of the request to retrieve.
 *     responses:
 *       200:
 *         description: Request found and returned successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestInfo'
 *       400:
 *         description: Request not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_NOT_FOUND
 *       500:
 *         description: Internal server error while retrieving the request.
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
 *     RequestInfo:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         title:
 *           type: string
 *           example: "Request for extra research credits"
 *         category:
 *           type: string
 *           example: "Academic"
 *         credits:
 *           type: integer
 *           example: 3
 *         description:
 *           type: string
 *           example: "Requesting additional credits for project continuation."
 *         creator:
 *           type: string
 *           description: UUID of the user who created the request
 *           example: "1a2b3c4d-1234-5678-90ab-cdef12345678"
 *         accepted:
 *           type: boolean
 *           example: false
 *         accepted_by:
 *           type: string
 *           nullable: true
 *           description: UUID of the user who accepted the request, if any
 *           example: null
 *         from:
 *           type: string
 *           format: date-time
 *           example: "2025-10-25T09:00:00Z"
 *         to:
 *           type: string
 *           format: date-time
 *           example: "2025-10-30T17:00:00Z"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-20T12:00:00Z"
 */

router.get("/info", validateQuery(updateRequestQuerySchema), RequestService.getRequest as any)

export default router;