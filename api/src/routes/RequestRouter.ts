import express, {type RequestHandler} from "express";
import {validateBody, validateQuery} from "../middleware/validate.js";
import {
    createRequestSchema,
    idArrayQuerySchema,
    updateRequestQuerySchema,
    updateReuqestSchema
} from "../schemas/requestSchemas.js";
import RequestController from "../controllers/RequestController.js";

const router = express.Router();
/**
 * @swagger
 * components:
 *   schemas:
 *
 *     # ============================
 *     # REQUEST CREATION & UPDATE
 *     # ============================
 *     CreateRequestBody:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - credits
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the request.
 *           example: "Offer: Need help moving a couch"
 *         category:
 *           type: string
 *           description: Category or type of the request.
 *           example: "Household"
 *         credits:
 *           type: integer
 *           description: Number of credits associated with the request.
 *           example: 10
 *         description:
 *           type: string
 *           description: Optional detailed description of the request.
 *           example: "Need help carrying a couch from ground floor to second floor."
 *         from:
 *           type: string
 *           format: date-time
 *           description: Optional start date/time for the request.
 *           example: "2025-10-28T09:00:00Z"
 *         to:
 *           type: string
 *           format: date-time
 *           description: Optional end date/time for the request.
 *           example: "2025-10-28T12:00:00Z"
 *
 *     # ============================
 *     # QUERY PARAMETERS
 *     # ============================
 *     UpdateQueryParams:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique ID of the request being targeted (update, delete, get, accept).
 *           example: 42
 *
 *     # ============================
 *     # RESPONSE OBJECTS
 *     # ============================
 *     RequestResponse:
 *       type: object
 *       description: The created or updated request entry.
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique ID of the request.
 *           example: 42
 *         title:
 *           type: string
 *           example: "Offer: Need help moving a couch"
 *         category:
 *           type: string
 *           example: "RENT"
 *         credits:
 *           type: integer
 *           example: 10
 *         description:
 *           type: string
 *           example: "Need help carrying a couch from ground floor to second floor."
 *         from:
 *           type: string
 *           format: date-time
 *           example: "2025-10-28T09:00:00Z"
 *         to:
 *           type: string
 *           format: date-time
 *           example: "2025-10-28T12:00:00Z"
 *         prename:
 *           type: string
 *           description: Name of issuer of this request
 *           example: "John"
 *
 *     # ============================
 *     # DETAILED REQUEST INFO
 *     # ============================
 *     RequestInfo:
 *       allOf:
 *         - $ref: '#/components/schemas/RequestResponse'
 *
 *     # ============================
 *     # COMMON ERROR STRUCTURES
 *     # ============================
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "INTERNAL_SERVER_ERROR"
 */

/**
 * @swagger
 * /request:
 *   post:
 *     summary: Create a new request
 *     description: Creates a new request entry for the authenticated user. The user must not exceed the maximum number of pending requests (5).
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequestBody'
 *     responses:
 *       201:
 *         description: Request successfully created.
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
 */
router.post("/", validateBody(createRequestSchema), RequestController.create.bind(RequestController) as RequestHandler);

/**
 * @swagger
 * /request:
 *   delete:
 *     summary: Delete an existing request
 *     description: Deletes a request created by the authenticated user. The user can only delete requests they originally created.
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
 *         description: The unique identifier of the request to delete.
 *     responses:
 *       200:
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

router.delete("/", validateQuery(updateRequestQuerySchema), RequestController.delete.bind(RequestController) as unknown as RequestHandler);

/**
 * @swagger
 * /request:
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
 *             $ref: '#/components/schemas/CreateRequestBody'
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
router.patch("/", validateBody(updateReuqestSchema), validateQuery(updateRequestQuerySchema),RequestController.update.bind(RequestController) as unknown as RequestHandler)

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
 *         description: The request was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_NOT_FOUND
 *       403:
 *         description: The user cannot accept their own request or the request is already assigned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: FORBIDDEN_TO_ACCEPT_REQUEST
 *       500:
 *         description: Internal server error during acceptance.
 */

router.patch("/accept", validateQuery(updateRequestQuerySchema), RequestController.accept.bind(RequestController) as unknown as RequestHandler)

/**
 * @swagger
 * /request:
 *   get:
 *     summary: Get detailed information about a specific request
 *     description: Returns the full request object for a given request ID.
 *     tags:
 *       - Requests
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
 *       404:
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
 */

router.get("/", validateBody(idArrayQuerySchema), RequestController.get.bind(RequestController) as unknown as RequestHandler)

/**
 * @swagger
 * /request/nearby:
 *   get:
 *     summary: Get nearby requests
 *     description: Returns a list of requests located near the authenticated user's postal code.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nearby requests retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RequestInfo'
 *       500:
 *         description: Internal server error while retrieving nearby requests.
 */

router.get("/nearby", RequestController.nearby.bind(RequestController) as unknown as RequestHandler)

/**
 * @swagger
 * /request/self:
 *   get:
 *     summary: Get all requests created by the authenticated user
 *     description: Returns a list of all requests that were created by the currently authenticated user. Requires a valid session or bearer token.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all requests created by the authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 4
 *                   title:
 *                     type: string
 *                     example: "Mein Auftrag zum Hollzmachen"
 *                   category:
 *                     type: string
 *                     example: "Meine Kategorie"
 *                   credits:
 *                     type: integer
 *                     example: 200
 *                   description:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                   accepted_by:
 *                     type: string
 *                     nullable: true
 *                     description: User ID of the person who accepted the request, if any
 *                     example: null
 *                   from:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: null
 *                   to:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                     example: null
 *       401:
 *         description: Unauthorized — invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ungültige Sitzung!"
 *       500:
 *         description: Internal server error while fetching user's requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "INTERNAL_SERVER_ERROR"
 */
router.get("/self", RequestController.self.bind(RequestController) as RequestHandler)


/**
 * @openapi
 * /request/finish:
 *   post:
 *     summary: Finish a request created by the authenticated user
 *     description: >
 *       Marks a request as finished and performs a credit transfer between the creator and the accepted user.
 *       The authenticated user must be the original creator of the request.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []          # assuming JWT or similar auth
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: The ID of the request to finish.
 *     responses:
 *       200:
 *         description: Request successfully finished and credits transferred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                   description: ID of the user who created (and finished) the request.
 *                   example: "user_123"
 *                 to:
 *                   type: string
 *                   description: ID of the user who accepted the request.
 *                   example: "user_456"
 *                 amount:
 *                   type: number
 *                   description: The number of credits transferred.
 *                   example: 50
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Unauthorized – missing or invalid authentication token.
 *       403:
 *         description: The authenticated user is not the creator of this request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: CREATOR_TOKEN_MISMATCH
 *       404:
 *         description: The request does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_DOES_NOT_EXIST
 *       409:
 *         description: The request has not been accepted yet.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: REQUEST_NOT_ACCEPTED
 *       402:
 *         description: Insufficient balance for credit transfer.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: INSUFFICIENT_BALANCE
 *       500:
 *         description: Internal server error.
 */
router.post("/finish", validateQuery(updateRequestQuerySchema), RequestController.finish.bind(RequestController) as unknown as RequestHandler);

/**
 * @swagger
 * /request/accepted:
 *   get:
 *     summary: Get all accepted requests for the authenticated user
 *     description: >
 *       Returns a list of requests that have been accepted by the currently authenticated user.
 *       Requires authentication.
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of accepted requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "req_12345"
 *                   title:
 *                     type: string
 *                     example: "Math Tutoring Session"
 *                   category:
 *                     type: string
 *                     example: "Education"
 *                   credits:
 *                     type: integer
 *                     example: 20
 *                   description:
 *                     type: string
 *                     example: "Provide 1-hour math tutoring for high school students."
 *                   accepted_by:
 *                     type: string
 *                     example: "user_67890"
 *                   from:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-15T10:00:00Z"
 *                   to:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-10-15T11:00:00Z"
 *                   prename:
 *                     type: string
 *                     example: "Alice"
 *       401:
 *         description: Unauthorized – Missing or invalid authentication token.
 *       500:
 *         description: Internal server error – Unable to retrieve accepted requests.
 */
router.get("/accepted", RequestController.accepted.bind(RequestController) as RequestHandler);

export default router;