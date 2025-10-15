import type {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";


class AuthService {
    public static async getAccountInfo(req: Request, res: Response) {
        if(!req.session) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid Session")
        }

    }
}
export default AuthService;
