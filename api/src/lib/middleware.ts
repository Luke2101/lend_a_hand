import type {NextFunction} from "connect";
import type {Request, Response} from "express";
import {auth} from "./auth.js";
import {StatusCodes} from "http-status-codes";


export async function checkSignedIn(req: Request, res: Response, next: NextFunction) {

    const request = new Request("", {
        method: req.method,
        headers: new Headers(req.headers as Record<string, string>),
    })

    const session = await auth.api.getSession(request)
    if(!session) {
        res.status(StatusCodes.UNAUTHORIZED).send("Not Authorized")
    }
}