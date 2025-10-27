import type {Request, Response} from "express";
import type {SignInBody, SignUpBody} from "../schemas/authSchemas.js";
import AuthService from "../services/AuthService.js";
import {StatusCodes} from "http-status-codes";
import authService from "../services/AuthService.js";

class AuthController {

    private static authService = new AuthService();

    /**
     * Handles user registration.
     *
     * @param {Request<{}, {}, SignUpBody>} req - Express request object containing user registration data in `req.body`.
     * @param {Response} res - Express response object used to send back HTTP responses.
     *
     * @returns {Promise<void>} Sends HTTP responses:
     *  - 201 Created: User successfully registered.
     *    ```json
     *    { "message": "USER_CREATED" }
     *    ```
     *  - 409 Conflict: Email already in use.
     *    ```json
     *    { "message": "EMAIL_IN_USE" }
     *    ```
     *  - 500 Internal Server Error: Error during registration.
     */
    public static async signUp(req: Request<{}, {}, SignUpBody>, res: Response) {
        const result = await AuthController.authService.signUp(req.body);
        if(result == StatusCodes.CONFLICT) return res.status(StatusCodes.CONFLICT).send({message: "EMAIL_IN_USE"});
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        return res.status(StatusCodes.CREATED).send({message: "USER_CREATED"})
    }

    /**
     * Handles user login.
     *
     * @param {Request<{}, {}, SignInBody>} req - Express request object containing login credentials in `req.body`.
     * @param {Response} res - Express response object used to send back HTTP responses and set headers.
     *
     * @returns {Promise<void>} Sends HTTP responses:
     *  - 200 OK: User successfully logged in. Authentication headers (e.g., cookies) are set.
     *    ```json
     *    { "message": "LOGIN_SUCCESS" }
     *    ```
     *  - 401 Unauthorized: Invalid credentials or login failed.
     */
    public static async signIn(req: Request<{}, {}, SignInBody>, res: Response) {
        const result = await AuthController.authService.signIn(req.body);
        if(result == StatusCodes.UNAUTHORIZED) return res.status(StatusCodes.UNAUTHORIZED).send();
        return res.setHeaders(result).status(StatusCodes.OK).send({message: "LOGIN_SUCCESS"})
    }

}

export default AuthController;