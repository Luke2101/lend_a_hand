import express from "express";
import UserService from "../services/UserService.js";
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: User
 *   description: User account management
 */

/**
 * @swagger
 * /user/info:
 *   get:
 *     tags: [User]
 *     summary: Get authenticated user's account information
 *     description: Returns the currently authenticated user's account info. Requires valid session.
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
 *                   description: User ID
 *                   example: abc123def456
 *                 name:
 *                   type: string
 *                   description: Full name
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
 *                   description: User email
 *                   example: john.doe@example.com
 *                 emailVerified:
 *                   type: boolean
 *                   description: Whether the email is verified
 *                   example: true
 *                 image:
 *                   type: string
 *                   description: URL to user's profile image (nullable)
 *                   example: null
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Account creation timestamp
 *                   example: 2025-01-01T12:00:00.000Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: Last account update timestamp
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
 *         description: Unauthorized - invalid or missing session
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Invalid session!
 */
router.get("/info", UserService.getAccountInfo);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     tags: [User]
 *     summary: Logout the authenticated user
 *     description: Logs out the currently authenticated user by invalidating their session. Requires valid session.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized - invalid or missing session
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Ungültige Sitzung!
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post("/logout", UserService.logout);

export default router;