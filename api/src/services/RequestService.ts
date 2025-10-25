import type {CreateRequestBody} from "../schemas/requestSchemas.js";
import RequestOperations from "../db/operations/requestOperations.js";
import requestOperations from "../db/operations/requestOperations.js";
import {StatusCodes} from "http-status-codes";
import type {SRequest} from "../types.js";

class RequestService {

    private static USER_MAX_PENDING_REQUESTS  = 5;

    public static async createRequest(creatorId: string, requestBody: CreateRequestBody) {
        const canCreate = await RequestService.checkIfUserCanIssueRequest(creatorId);
        if(!canCreate) return StatusCodes.FORBIDDEN;
        const result = await RequestOperations.createRequest(requestBody, creatorId)
        if(!result) return StatusCodes.INTERNAL_SERVER_ERROR;
        return result;
    }


    public static async deleteRequest(userId: string, requestId: number) {
        const didUserCreateRequest = await RequestService.didUserCreateRequest(userId, requestId);
        if(!didUserCreateRequest) return StatusCodes.FORBIDDEN;
        const deleteDidSucceed = await RequestOperations.deleteRequest(requestId)
        if(!deleteDidSucceed) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.OK;
    }

    public static async updateRequest(requestId: number, userId: string, requestBody: CreateRequestBody) {
        const didUserCreateRequest = await RequestService.didUserCreateRequest(userId, requestId);
        if(!didUserCreateRequest) return StatusCodes.FORBIDDEN;
        const request: SRequest = {
            id: requestId,
            credits: requestBody.credits,
            category: requestBody.category,
            title: requestBody.title,
            from: requestBody.from,
            to: requestBody.to,
            description: requestBody.description
        } as SRequest
        const didRequestUpdate = await RequestOperations.updateRequest(request)
        if(!didRequestUpdate) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.OK;

    }


    public static async acceptRequest(requestId: number, userId: string) {
        const originalRequest = await requestOperations.getRequestById(requestId);
        if(originalRequest === undefined)        return StatusCodes.INTERNAL_SERVER_ERROR;
        if(originalRequest === null)             return StatusCodes.NOT_FOUND;
        if(originalRequest.creator == userId)   return StatusCodes.FORBIDDEN;
        if(originalRequest.accepted_by != null) return StatusCodes.FORBIDDEN;

        const result = await RequestOperations.acceptRequest(requestId, userId);
        if(!result) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.OK;
    }

    public static async getRequest(requestId: number) {
        const originalRequest = await requestOperations.getRequestById(requestId);
        if(originalRequest === undefined)        return StatusCodes.INTERNAL_SERVER_ERROR;
        if(originalRequest === null)             return StatusCodes.NOT_FOUND;
        return originalRequest;
    }

    public static async getRequestsNearby(userId: string, userPlz: number) {
        const results = await RequestOperations.getOpenRequestsNearbyForPlz(userPlz)
        if(results == undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        const ownRequestsOfUser = await requestOperations.getAllUserRequests(userId);
        if(ownRequestsOfUser == undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        const ownRequestsOfUserIds = ownRequestsOfUser.map(request => request.id);
        return results.filter(request => !ownRequestsOfUserIds.includes(request.id));

    }

    public static async getRequestsForUser(userId: string) {
        const results = await RequestOperations.getAllUserRequests(userId);
        if(results === undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        if(results === null) return [];
        return results;
    }


    private static async checkIfUserCanIssueRequest(userId: string) {
        const pendingReqForUser = await RequestOperations.getAllUserRequests(userId)
        if(pendingReqForUser == undefined) return false;
        return pendingReqForUser.length < RequestService.USER_MAX_PENDING_REQUESTS;
    }

    private static async didUserCreateRequest(userId: string, requestId: number): Promise<boolean> {
        const pendingReqForUser = await RequestOperations.getAllUserRequests(userId);
        if(pendingReqForUser == undefined) return false;
        return pendingReqForUser.filter(req => req.id == requestId).length > 0
    }

}
export default RequestService;
