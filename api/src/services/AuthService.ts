import type {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import UserOperations from "../db/operations/userOperations.js";
import {auth} from "../lib/auth.js";
import type {SignInBody, SignUpBody} from "../schemas/authSchemas.js";
import logger from "../util/logger.js";
import {fromNodeHeaders} from "better-auth/node";

class AuthService {
    public static async signUp(req: Request<{}, {}, SignUpBody>, res: Response) {
        const emailExists: boolean = await UserOperations.checkIfEmailExists(req.body.email);
        if(emailExists) {
            return res.status(StatusCodes.CONFLICT).send("Benutzer mit dieser Email-Adresse existiert bereits")
        }
        const userCreated = await UserOperations.createUser(req.body);
        if(!userCreated) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Fehler beim erstellen eines Benutzers")
        return res.status(StatusCodes.CREATED).send("Benutzer erfolgreich registriert!")
    }

    public static async signIn(req: Request<{}, {}, SignInBody>, res: Response) {
        const result = await auth.api.signInEmail({
            body: {
                email: req.body.email,
                password: req.body.password,
            },
            asResponse: true
        })

        if(!result.ok) {
            logger.debug(`User failed to log in with email=[${req.body.email}]`)
            res.status(StatusCodes.UNAUTHORIZED).send();
            return;
        }


        res.setHeaders(result.headers)
            .status(200)
            .send({message: "Erfolgreich angemeldet!" })

        logger.debug(`User logged in with email=[${req.body.email}]`)
    }
}
export default AuthService;
