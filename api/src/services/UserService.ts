import type {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {auth} from "../lib/auth.js";
import {fromNodeHeaders} from "better-auth/node";


class AuthService {
    public static async getAccountInfo(req: Request, res: Response) {
        return res.status(200).json(req.session.user)

    }

    public static async logout(req: Request, res:Response) {
        const headers = fromNodeHeaders(req.headers);
        await auth.api.signOut({headers})
        res.status(StatusCodes.NO_CONTENT).send();

    }
}
export default AuthService;
