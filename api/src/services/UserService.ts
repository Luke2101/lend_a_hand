import type {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {auth, db} from "../lib/auth.js";
import {fromNodeHeaders} from "better-auth/node";
import type {UpdateBody} from "../schemas/userSchemas.js";
import {betterAuth, type Session} from "better-auth";
import {eq} from "drizzle-orm";
import {user} from "../db/auth-schema.js";
import logger from "../util/logger.js";


class UserSerivce {
    public static async getAccountInfo(req: Request, res: Response) {
        return res.status(200).json(req.user)

    }

    public static async logout(req: Request, res:Response) {
        const headers = fromNodeHeaders(req.headers);
        const response = await auth.api.signOut({headers, asResponse: true})
        res.setHeaders(response.headers);
        res.status(StatusCodes.NO_CONTENT).send();

    }

    public static async updateProfile(req: Request<{},{},UpdateBody>, res:Response) {
        const session: Session = req.session;

        if(Object.keys(req.body).length == 0) {
            res.status(StatusCodes.BAD_REQUEST).send("Request fehlerhaft")
            return;
        }

        try {
            await db.update(user).set(req.body).where(eq(user.id, session.userId))
            res.status(StatusCodes.NO_CONTENT).send("Profil aktualisiert")
        } catch (err: any) {
            logger.error(err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Fehler bei der Verarbeitung")

        }


    }
}
export default UserSerivce;
