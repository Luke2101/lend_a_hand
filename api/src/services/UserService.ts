import type {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import UserOperations from "../db/operations/userOperations.js";
import {auth} from "../lib/auth.js";

class UserService {
    public async signUp(req: Request, res: Response) {
        if(req.body == undefined) {
            res.status(StatusCodes.BAD_REQUEST).send("Kein RequestBody enthalten")
            return;
        }

        const {prename, surname, plz, street, houseNumber, city, email, password} = req.body;

        // Basic validation
        if (!prename || !surname || !plz || !street || !houseNumber || !city || !email || !password) {
            return res.status(StatusCodes.BAD_REQUEST).send("Request ist unvollständig")
        }

        const emailExists = await UserOperations.checkIfEmailExists(email);

        if(emailExists) {
            return res.status(StatusCodes.CONFLICT).send("Benutzer mit dieser Email-Adresse existiert bereits")
        }

        const creationPromise = UserOperations.createUser(prename, surname, plz, street, houseNumber, city, email, password)
        creationPromise.then(() => {
            return res.status(StatusCodes.CREATED).send("Benutzer erfolgreich registriert!")
        }).catch(() => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Fehler beim erstellen eines Benutzers")
        })


    }

    public async signIn(req: Request, res: Response) {
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
export default new UserService();
