import express, { type RequestHandler } from "express";
import {validateBody, validateQuery} from "../middleware/validate.js";
import { updateSchema } from "../schemas/userSchemas.js";
import UserController from "../controllers/UserController.js";
import {idParamStringQuerySchema} from "../schemas/requestSchemas.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User account management and authentication
 */

/**
 * @swagger
 * /user/info:
 *   get:
 *     tags: [User]
 *     summary: Get authenticated user's account information
 *     description: Returns the profile data of the currently authenticated user. Requires a valid session or bearer token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account info retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique user ID
 *                   example: abc123def456
 *                 name:
 *                   type: string
 *                   description: Display or full name
 *                   example: John Doe
 *                 prename:
 *                   type: string
 *                   description: First name
 *                   example: John
 *                 surname:
 *                   type: string
 *                   description: Last name
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   description: Email address
 *                   example: john.doe@example.com
 *                 emailVerified:
 *                   type: boolean
 *                   description: Whether the user's email has been verified
 *                   example: true
 *                 image:
 *                   type: string
 *                   nullable: true
 *                   description: URL to the user's profile image
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the account was created
 *                   example: 2025-01-01T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of the last profile update
 *                   example: 2025-05-01T12:00:00.000Z
 *                 street:
 *                   type: string
 *                   example: Example Street
 *                 houseNumber:
 *                   type: string
 *                   example: 42A
 *                 plz:
 *                   type: integer
 *                   example: 12345
 *                 city:
 *                   type: string
 *                   example: Sample City
 *       401:
 *         description: Unauthorized — invalid or missing session
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Ungültige Sitzung!"
 */
router.get("/info", UserController.info.bind(UserController) as RequestHandler);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     tags: [User]
 *     summary: Log out the authenticated user
 *     description: Invalidates the user's current session or token, effectively logging them out. Requires a valid session.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: LOGGED_OUT
 *       401:
 *         description: Unauthorized — invalid or missing session
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Ungültige Sitzung!"
 */
router.post("/logout", UserController.logout.bind(UserController));

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Update the profile of the currently authenticated user
 *     description: Updates one or more user profile fields (first name, last name, address, etc.) for the logged-in user. Only provided fields will be updated.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prename:
 *                 type: string
 *                 example: John
 *               surname:
 *                 type: string
 *                 example: Doe
 *               plz:
 *                 type: integer
 *                 example: 90210
 *               street:
 *                 type: string
 *                 example: Main Street
 *               houseNumber:
 *                 type: string
 *                 example: 42A
 *               city:
 *                 type: string
 *                 example: Los Angeles
 *             description: Fields to update (all optional)
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Change erfolgreich"
 *       400:
 *         description: Invalid request body or validation error
 *       401:
 *         description: Unauthorized — invalid or missing session
 *       500:
 *         description: Internal server error while updating the user
 */
router.patch("/", validateBody(updateSchema), UserController.update.bind(UserController) as RequestHandler);


/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get basic user information
 *     description: Returns prename, email, and postal code for a given user ID.
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to fetch.
 *     responses:
 *       200:
 *         description: Successfully retrieved user info.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prename:
 *                   type: string
 *                   example: "Marvin"
 *                 email:
 *                   type: string
 *                   example: "marvin@example.com"
 *                 plz:
 *                   type: string
 *                   example: "12345"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "USER_NOT_FOUND"
 */
router.get("/", validateQuery(idParamStringQuerySchema), UserController.get.bind(UserController) as unknown as RequestHandler)

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

export default router;
