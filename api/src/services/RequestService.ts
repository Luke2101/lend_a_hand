import type {Request, Response} from "express";
import type {CreateRequestBody, DeleteRequestBody, UpdateQueryParams} from "../schemas/requestSchemas.js";
import RequestOperations from "../db/operations/requestOperations.js";
import {StatusCodes} from "http-status-codes";
import type {User} from "better-auth";
import type {SRequest} from "../types.js";
import requestOperations from "../db/operations/requestOperations.js";

class RequestService {

    private static USER_MAX_PENDING_REQUESTS  = 5;

    public static async createRequest(req: Request<{},{},CreateRequestBody>, res: Response) {

        const creator = req.user as User;

        const canCreate = await RequestService.checkIfUserCanIssueRequest(creator);
        if(!canCreate) {
            res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_LIMIT_REACHED"})
            return;
        }

        const result = await RequestOperations.createRequest(req.body, creator.id)
        if(!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "INTERNAL_SERVER_ERROR"})
            return;
        }

        res.status(StatusCodes.CREATED).send(result)
    }


    public static async deleteRequest(req: Request<{}, {}, DeleteRequestBody>, res: Response) {
        const didUserCreateRequest = await RequestService.didUserCreateRequest(req.user as User, req.body.id);
        if(!didUserCreateRequest) {
            res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_CREATOR_TOKEN_MISMATCH"})
            return;
        }
        const deleteDidSucceed = await RequestOperations.deleteRequest(req.body.id)
        if(!deleteDidSucceed) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "ERROR_DURING_DELETION"})
            return;
        }

        res.status(StatusCodes.OK).send({message: "DELETED"})
    }

    public static async updateRequest(req: Request<{}, {}, CreateRequestBody, UpdateQueryParams>, res: Response) {
        const requestId = req.query.id;



        const didUserCreateRequest = await RequestService.didUserCreateRequest(req.user as User, requestId);
        if(!didUserCreateRequest) {
            res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_CREATOR_TOKEN_MISMATCH"})
            return;
        }

        const reqId = req.query.id;

        const request: SRequest = {
            id: reqId,
            credits: req.body.credits,
            category: req.body.category,
            title: req.body.title,
            from: req.body.from,
            to: req.body.to,
            description: req.body.description
        } as SRequest

        const didRequestUpdate = await RequestOperations.updateRequest(request)

        if(!didRequestUpdate) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "UNABLE_TO_UPDATE_REQUEST"})
            return;
        }
        res.status(StatusCodes.OK).send({message: "REQUEST_UPDATED"})
    }


    public static async acceptRequest(req: Request<{},{}, {},UpdateQueryParams>, res: Response) {
        const reqId = req.query.id;
        const userId = req.user!.id;
        const originalRequest = await requestOperations.getRequestById(reqId);
        if(originalRequest == undefined)        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        if(originalRequest == null)             return res.status(StatusCodes.BAD_REQUEST).send({message: "REQUEST_NOT_FOUND"})
        if(originalRequest.creator == userId)   return res.status(StatusCodes.FORBIDDEN).send({message: "CANNOT_ACCEPT_OWN_REQUESTS"});
        if(originalRequest.accepted_by != null) return res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_ALREADY_ASSIGNED"});

        const result = await RequestOperations.acceptRequest(reqId, userId);
        if(!result) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        return res.status(StatusCodes.OK).send({message: "REQUEST_ACCEPTED", id: reqId})
    }

    public static async getRequest(req: Request<{},{}, {},UpdateQueryParams>, res: Response) {
        const reqId = req.query.id;
        const originalRequest = await requestOperations.getRequestById(reqId);
        if(originalRequest == undefined)        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        if(originalRequest == null)             return res.status(StatusCodes.BAD_REQUEST).send({message: "REQUEST_NOT_FOUND"})

        return res.status(200).send(originalRequest);
    }


    private static async checkIfUserCanIssueRequest(user:User) {
        const pendingReqForUser = await RequestOperations.getAllUserRequests(user)
        if(pendingReqForUser == undefined) return false;
        return pendingReqForUser.length < RequestService.USER_MAX_PENDING_REQUESTS;

    }

    private static async didUserCreateRequest(user: User, requestId: number): Promise<boolean> {
        const pendingReqForUser = await RequestOperations.getAllUserRequests(user);
        if(pendingReqForUser == undefined) return false;
        console.log(pendingReqForUser)
        return pendingReqForUser.filter(req => req.id == requestId).length > 0
    }

}
export default RequestService;
