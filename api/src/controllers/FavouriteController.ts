import type {AuthenticatedRequest} from "../types.js";
import type {Response} from "express";
import FavouriteService from "../services/FavouriteService.js";
import {StatusCodes} from "http-status-codes";
import type {UpdateQueryParams} from "../schemas/requestSchemas.js";

class FavouriteController {


    public static async get(req: AuthenticatedRequest, res: Response) {
        const result = await FavouriteService.getInterestsForUser(req.user.id)
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
        return res.status(StatusCodes.OK).send(result);
    }

    public static async remove(req: AuthenticatedRequest<{},{},{},UpdateQueryParams>, res: Response) {
        const resultStatusCode = await FavouriteService.removeInterest(req.user.id, req.query.id);
        return res.status(resultStatusCode).send();
    }

    public static async add(req: AuthenticatedRequest<{},{},{},UpdateQueryParams>, res: Response) {
        const resultStatusCode = await FavouriteService.addInterest(req.user.id, req.query.id);
        return res.status(resultStatusCode).send();
    }
}

export default FavouriteController;