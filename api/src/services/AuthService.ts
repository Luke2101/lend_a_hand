import {StatusCodes} from "http-status-codes";
import UserOperations from "../db/operations/userOperations.js";
import {auth} from "../lib/auth.js";
import type {SignInBody, SignUpBody} from "../schemas/authSchemas.js";
import logger from "../util/logger.js";

class AuthService {
    public static async signUp(requestBody: SignUpBody) {
        const emailExists: boolean = await UserOperations.checkIfEmailExists(requestBody.email);
        if(emailExists) return StatusCodes.CONFLICT;
        const userCreated = await UserOperations.createUser(requestBody);
        if(!userCreated) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.CREATED;
    }

    public static async signIn(requestBody: SignInBody) {
        const result = await auth.api.signInEmail({
            body: requestBody,
            asResponse: true
        })
        if(!result.ok) {
            logger.debug(`User failed to log in with email=[${requestBody.email}]`)
            return StatusCodes.UNAUTHORIZED;
        }
        logger.debug(`User logged in with email=[${requestBody.email}]`)
        return result.headers;
    }
}
export default AuthService;
