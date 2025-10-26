import FavouriteOperations from "../db/operations/favouriteOperations.js";
import {StatusCodes} from "http-status-codes";
import RequestService from "./RequestService.js";

class FavouriteService {
    public static async getInterestsForUser(userId: string) {
        const result = await FavouriteOperations.getInterestsForUserById(userId);
        if(result === undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        return result;
    }

    public static async addInterest(userId: string, requestId: number) {
        const request = await RequestService.getRequest(requestId)
        if(request == StatusCodes.NOT_FOUND) return request;
        if(request == StatusCodes.INTERNAL_SERVER_ERROR) return request;
        const currentUserInterests = await FavouriteOperations.getInterestsForUserById(userId);
        if(currentUserInterests === undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        if(currentUserInterests.includes(Number(requestId))) return StatusCodes.CONFLICT;
        const addResult = await FavouriteOperations.addRequestToInterests(requestId, userId);
        if(!addResult) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.CREATED;

    }

    public static async removeInterest(userId: string, requestId: number) {
        const result = await FavouriteOperations.removeInterestInRequestForUser(requestId, userId) ;
        if(!result) return StatusCodes.CONFLICT;
        return StatusCodes.NO_CONTENT;
    }
}

export default FavouriteService;