import express from "express";
import AuthService from "../services/AuthService.js";
import { validateBody } from "../middleware/validate.js";
import { signInSchema, signUpSchema } from "../schemas/authSchemas.js";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prename:
 *                 type: string
 *                 example: Max
 *               surname:
 *                 type: string
 *                 example: Mustermann
 *               plz:
 *                 type: integer
 *                 example: 12345
 *               street:
 *                 type: string
 *                 example: Hauptstraße
 *               houseNumber:
 *                 type: string
 *                 example: 12A
 *               city:
 *                 type: string
 *                 example: Berlin
 *               email:
 *                 type: string
 *                 format: email
 *                 example: max@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *             required:
 *               - prename
 *               - surname
 *               - plz
 *               - street
 *               - houseNumber
 *               - city
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully registered
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */
router.post("/signup", validateBody(signUpSchema), AuthController.signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       description: User login data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: max@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateBody(signInSchema), AuthController.signIn);

export default router;
