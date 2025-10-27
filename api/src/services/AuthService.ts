import {StatusCodes} from "http-status-codes";
import UserRepository from "../repositories/UserRepository.js";
import {auth} from "../lib/auth.js";
import type {SignInBody, SignUpBody} from "../schemas/authSchemas.js";
import logger from "../util/logger.js";
import Service from "./Service.js";

class AuthService extends Service<UserRepository>{

    constructor() {
        super(new UserRepository());
    }

    public async signUp(requestBody: SignUpBody) {
        const emailExists: boolean = await this.repository().checkIfEmailExists(requestBody.email);
        if(emailExists) return StatusCodes.CONFLICT;
        const userCreated = await this.repository().createUser(requestBody);
        if(!userCreated) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.CREATED;
    }

    public async signIn(requestBody: SignInBody) {
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
