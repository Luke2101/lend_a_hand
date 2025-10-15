import type {Response, Request} from "express";
import {auth} from "../lib/auth.js";
import {StatusCodes} from "http-status-codes";
import type {NextFunction} from "connect";
import {fromNodeHeaders} from "better-auth/node";
import logger from "../util/logger.js";

export async function authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const headers = fromNodeHeaders(req.headers);
    const session = await auth.api.getSession({headers});

    if(!session || !session.user) {
        res.status(StatusCodes.UNAUTHORIZED).send("Ungültige Sitzung!");
        return;
    }
    req.session = session;

    next();
}