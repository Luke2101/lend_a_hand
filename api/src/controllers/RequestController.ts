import {StatusCodes} from "http-status-codes";
import RequestService from "../services/RequestService.js";
import type {Request, Response} from "express";
import type {CreateRequestBody, UpdateQueryParams} from "../schemas/requestSchemas.js";
import type {AuthenticatedRequest} from "../types.js";

class RequestController {

    public static async create(req: AuthenticatedRequest<{},{},CreateRequestBody>, res: Response) {
        const result = await RequestService.createRequest(req.user.id, req.body);
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        if(result == StatusCodes.FORBIDDEN) return res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_LIMIT_REACHED"})
        return res.status(StatusCodes.CREATED).send(result);
    }

    public static async delete(req: AuthenticatedRequest<{},{}, {},UpdateQueryParams>, res: Response) {
        const result = await RequestService.deleteRequest(req.user.id,req.query.id)
        if(result == StatusCodes.FORBIDDEN) return res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_CREATOR_TOKEN_MISMATCH"});
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "ERROR_DURING_DELETION"})
        return res.status(StatusCodes.OK).send({message: "DELETED"})
    }

    public static async update(req: AuthenticatedRequest<{}, {}, CreateRequestBody, UpdateQueryParams>, res: Response) {
        const result = await RequestService.updateRequest(req.query.id, req.user.id, req.body)
        if(result == StatusCodes.FORBIDDEN) return res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_CREATOR_TOKEN_MISMATCH"});
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "UNABLE_TO_UPDATE_REQUEST"});
        if(result == StatusCodes.OK) return res.status(StatusCodes.OK).send({message: "REQUEST_UPDATED"});
    }

    public static async accept(req: AuthenticatedRequest<{},{}, {},UpdateQueryParams>, res: Response) {
        const result: StatusCodes = await RequestService.acceptRequest(req.query.id,req.user.id);
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        if(result == StatusCodes.NOT_FOUND) return res.status(StatusCodes.NOT_FOUND).send({message: "REQUEST_NOT_FOUND"});
        if(result == StatusCodes.FORBIDDEN) return res.status(StatusCodes.FORBIDDEN).send({message: "FORBIDDEN_TO_ACCEPT_REQUEST"})
        return res.status(StatusCodes.OK).send({message: "REQUEST_ACCEPTED", id: req.query.id})
    }

    public static async get(req: Request<{},{}, {},UpdateQueryParams>, res: Response) {
        const result = await RequestService.getRequest(req.query.id)
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        if(result == StatusCodes.NOT_FOUND) return res.status(StatusCodes.NOT_FOUND).send({message: "REQUEST_NOT_FOUND"})
        return res.status(StatusCodes.OK).send(result);
    }

    public static async nearby(req: AuthenticatedRequest, res: Response) {
        const result = await RequestService.getRequestsNearby(req.user.id,req.user.plz);
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
        return res.status(StatusCodes.OK).send(result);
    }

    public static async self(req: AuthenticatedRequest, res: Response){
        const result = await RequestService.getRequestsForUser(req.user.id);
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(StatusCodes.OK).send(result);
    }


}

export default RequestController;