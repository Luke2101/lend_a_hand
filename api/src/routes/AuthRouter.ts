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
 * components:
 *   schemas:
 *     SignUpRequest:
 *       type: object
 *       required:
 *         - prename
 *         - surname
 *         - plz
 *         - street
 *         - houseNumber
 *         - city
 *         - email
 *         - password
 *       properties:
 *         prename:
 *           type: string
 *           description: User's first name
 *           example: Max
 *         surname:
 *           type: string
 *           description: User's last name
 *           example: Mustermann
 *         plz:
 *           type: integer
 *           description: Postal code (must be between 1000 and 99999)
 *           minimum: 1000
 *           maximum: 99999
 *           example: 12345
 *         street:
 *           type: string
 *           description: Street name
 *           example: Hauptstraße
 *         houseNumber:
 *           type: string
 *           description: House number
 *           example: "12A"
 *         city:
 *           type: string
 *           description: City name
 *           example: Berlin
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: max@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters)
 *           minLength: 6
 *           example: password123
 *     SignInRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: max@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: password123
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 description: The field that failed validation
 *               message:
 *                 type: string
 *                 description: Error message
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpRequest'
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/signup", validateBody(signUpSchema), AuthController.signUp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInRequest'
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     prename:
 *                       type: string
 *                     surname:
 *                       type: string
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *             description: Authentication cookie set
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", validateBody(signInSchema), AuthController.signIn);

export default router;