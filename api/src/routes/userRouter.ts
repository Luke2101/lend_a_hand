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
 *                 email:
 *                   type: string
 *                   description: User email
 *                 name:
 *                   type: string
 *                   description: User name
 *                 # Add other user properties here
 *       401:
 *         description: Unauthorized - invalid or missing session
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Ungültige Sitzung!
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