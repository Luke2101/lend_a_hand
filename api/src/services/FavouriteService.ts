import FavouriteRepository from "../repositories/FavouriteRepository.js";
import {StatusCodes} from "http-status-codes";
import RequestService from "./RequestService.js";
import Service from "./Service.js";

class FavouriteService extends Service<FavouriteRepository>{

    private requestService: RequestService | undefined

    constructor() {
        super(new FavouriteRepository())
        this.requestService = new RequestService();
    }

    public setRequestServie(reqs: RequestService) {
        this.requestService = reqs;
    }
    public async getInterestsForUser(userId: string) {
        const result = await this.repository().getInterestsForUserById(userId);
        if(result === undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        return result;
    }

    public async addInterest(userId: string, requestId: number) {
        const request = await this.requestService?.getRequest([requestId])
        if(request === undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        if(request == StatusCodes.NOT_FOUND) return request;
        if(request == StatusCodes.INTERNAL_SERVER_ERROR) return request;
        if(await this.requestService?.didUserCreateRequest(userId, requestId)) return StatusCodes.FORBIDDEN;
        const currentUserInterests = await this.repository().getInterestsForUserById(userId);
        if(currentUserInterests === undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        if(currentUserInterests.includes(Number(requestId))) return StatusCodes.CONFLICT;
        const addResult = await this.repository().addRequestToInterests(requestId, userId);
        if(!addResult) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.CREATED;

    }

    public async removeInterest(userId: string, requestId: number) {
        const result = await this.repository().removeInterestInRequestForUser(requestId, userId) ;
        if(!result) return StatusCodes.CONFLICT;
        return StatusCodes.NO_CONTENT;
    }
}

export default FavouriteService;