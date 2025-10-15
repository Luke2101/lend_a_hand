import express, {type Request} from "express";
import {auth} from "../lib/auth.js";
import {StatusCodes} from "http-status-codes";

export async function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const request = new Request("", {
        method: req.method,
        headers: new Headers(req.headers as Record<string, string>),
    })

    const session = await auth.api.getSession(request)
    if(!session) {
        res.status(StatusCodes.UNAUTHORIZED).send("Not Authorized")
    }

    next();
}