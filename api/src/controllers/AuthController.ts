import type {Request, Response} from "express";
import type {SignInBody, SignUpBody} from "../schemas/authSchemas.js";
import AuthService from "../services/AuthService.js";
import {StatusCodes} from "http-status-codes";

class AuthController {
    public static async signUp(req: Request<{}, {}, SignUpBody>, res: Response) {
        const result = await AuthService.signUp(req.body);
        if(result == StatusCodes.CONFLICT) return res.status(StatusCodes.CONFLICT).send({message: "EMAIL_IN_USE"});
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        return res.status(StatusCodes.CREATED).send({message: "USER_CREATED"})
    }

    public static async signIn(req: Request<{}, {}, SignInBody>, res: Response) {
        const result = await AuthService.signIn(req.body);
        if(result == StatusCodes.UNAUTHORIZED) return res.status(StatusCodes.UNAUTHORIZED).send();
        return res.setHeaders(result).status(StatusCodes.OK).send({message: "LOGIN_SUCCESS"})
    }

}

export default AuthController;