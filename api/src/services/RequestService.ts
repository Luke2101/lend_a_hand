import type {Request, Response} from "express";
import type {CreateRequestBody} from "../schemas/requestSchemas.js";
import RequestOperations from "../db/operations/requestOperations.js";
import {StatusCodes} from "http-status-codes";
import type {User} from "better-auth";

class RequestService {

    private static USER_MAX_PENDING_REQUESTS  = 5;

    public static async createRequest(req: Request<{},{},CreateRequestBody>, res: Response) {

        const creator = req.user as User;
        const result = await RequestOperations.createRequest(req.body, creator.id)
        if(!result) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "INTERNAL_SERVER_ERROR"})
            return;
        }
        const canCreate = await RequestService.checkIfUserCanIssueRequest(creator);
        if(!canCreate) {
            res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_LIMIT_REACHED"})
            return;
        }
        res.status(StatusCodes.CREATED).send({message: "Created Entry"})
    }


    private static async checkIfUserCanIssueRequest(user:User) {
        const pendingReqForUser = await RequestOperations.getAllUserRequests(user)
        if(pendingReqForUser == undefined) return false;
        return pendingReqForUser.length < RequestService.USER_MAX_PENDING_REQUESTS;

    }

}
export default RequestService;
