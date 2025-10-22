import type {Request, Response} from "express";
import type {CreateRequestBody, DeleteRequestBody} from "../schemas/requestSchemas.js";
import RequestOperations from "../db/operations/requestOperations.js";
import {StatusCodes} from "http-status-codes";
import type {User} from "better-auth";

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


    private static async checkIfUserCanIssueRequest(user:User) {
        const pendingReqForUser = await RequestOperations.getAllUserRequests(user)
        if(pendingReqForUser == undefined) return false;
        return pendingReqForUser.length < RequestService.USER_MAX_PENDING_REQUESTS;

    }

    private static async didUserCreateRequest(user: User, requestId: number): Promise<boolean> {
        const pendingReqForUser = await RequestOperations.getAllUserRequests(user);
        if(pendingReqForUser == undefined) return false;
        return pendingReqForUser.filter(req => req.id == requestId).length > 0
    }

}
export default RequestService;
