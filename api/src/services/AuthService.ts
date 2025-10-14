import type {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import UserOperations from "../db/operations/userOperations.js";
import {auth} from "../lib/auth.js";
import type {SignInBody, SignUpBody} from "../schemas/authSchemas.js";

class AuthService {
    public static async signUp(req: Request<{}, {}, SignUpBody>, res: Response) {
        const emailExists: boolean = await UserOperations.checkIfEmailExists(req.body.email);
        if(emailExists) {
            return res.status(StatusCodes.CONFLICT).send("Benutzer mit dieser Email-Adresse existiert bereits")
        }
        const creationPromise = UserOperations.createUser(req.body)

        creationPromise.then(() => {
            return res.status(StatusCodes.CREATED).send("Benutzer erfolgreich registriert!")
        }).catch(() => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Fehler beim erstellen eines Benutzers")
        })


    }

    public static async signIn(req: Request<{}, {}, SignInBody>, res: Response) {
        try {
            const result = await auth.api.signInEmail({
                body: {
                    email: req.body.email,
                    password: req.body.password,
                }
            })
            return res.status(200).json(result.token);
        }catch(err: any) {
            return res.status(StatusCodes.UNAUTHORIZED).send(err.body.code);
        }

    }
}
export default AuthService;
