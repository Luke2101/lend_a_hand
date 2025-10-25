import {StatusCodes} from "http-status-codes";
import UserSerivce from "../services/UserService.js";
import type {Request, Response} from "express";
import type {AuthenticatedRequest} from "../types.js";
import type {UpdateUserBody} from "../schemas/userSchemas.js";
import UserService from "../services/UserService.js";

class UserController {

    public static async logout(req: Request, res: Response) {
        const result = await UserSerivce.logout(req)
        return res.setHeaders(result).status(StatusCodes.NO_CONTENT).send();
    }

    public static async info(req: AuthenticatedRequest, res: Response) {
        return res.status(StatusCodes.OK).send(req.user);
    }

    public static async update(req: AuthenticatedRequest<{},{},UpdateUserBody>, res: Response) {
        const result = await UserService.updateProfile(req.session,req.body);
        if(result == StatusCodes.BAD_REQUEST) return res.status(StatusCodes.BAD_REQUEST).send();
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        return res.status(StatusCodes.OK).send({message: "USER_UPDATED"})
    }

}

export default UserController;