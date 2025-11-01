import type {CreateRequestBody, UpdateRequestBody} from "../schemas/requestSchemas.js";
import RequestRepository from "../repositories/RequestRepository.js";
import {StatusCodes} from "http-status-codes";
import type {SRequest} from "../types.js";
import Service from "./Service.js";
import UserService from "./UserService.js";
import logger from "../util/logger.js";

class RequestService extends Service<RequestRepository>{

    private static USER_MAX_PENDING_REQUESTS= 5;

    constructor() {
        super(new RequestRepository());
    }

    private readonly userService = new UserService();

    /**
     * Creates a new service request for a user
     * @param {string} creatorId - ID of the user creating the request
     * @param {CreateRequestBody} requestBody - Data for the new request
     * @param accountBalance - Current Amount if the users balance
     * @returns {Promise<Object|StatusCodes>} Created request object or status code
     *
     * @throws {403} FORBIDDEN - When user has reached maximum pending requests
     * @throws {500} INTERNAL_SERVER_ERROR - When request creation fails
     */
    public async createRequest(creatorId: string, requestBody: CreateRequestBody, accountBalance: number): Promise<object | StatusCodes> {
        const hasUserEnoughCredits = await this.hasUserEnoughCredits(creatorId,accountBalance,requestBody.credits);
        if(!hasUserEnoughCredits) return StatusCodes.PAYMENT_REQUIRED;
        const canCreate = await this.canUserCreateRequest(creatorId);
        if(!canCreate) return StatusCodes.FORBIDDEN;
        const result = await this.repository().createRequest(requestBody, creatorId)
        if(!result) return StatusCodes.INTERNAL_SERVER_ERROR;
        return result;
    }

    /**
     * Deletes a specific request
     * @param {string} userId - ID of the user attempting deletion
     * @param {number} requestId - ID of the request to delete
     * @returns {Promise<StatusCodes>} Status code indicating result of operation
     *
     * @throws {403} FORBIDDEN - When user is not the creator of the request
     * @throws {500} INTERNAL_SERVER_ERROR - When deletion fails
     */
    public async deleteRequest(userId: string, requestId: number) {
        const didUserCreateRequest = await this.didUserCreateRequest(userId, requestId);
        if(!didUserCreateRequest) return StatusCodes.FORBIDDEN;
        const deleteDidSucceed = await this.repository().deleteRequest(requestId)
        if(!deleteDidSucceed) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.OK;
    }

    /**
     * Updates an existing request
     * @param {number} requestId - ID of the request to update
     * @param {string} userId - ID of the user attempting update
     * @param {CreateRequestBody} requestBody - New data for the request
     * @returns {Promise<StatusCodes>} Status code indicating result of operation
     *
     * @throws {403} FORBIDDEN - When user is not the creator of the request
     * @throws {500} INTERNAL_SERVER_ERROR - When update fails
     */
    public async updateRequest(requestId: number, userId: string, requestBody: UpdateRequestBody){
        const didUserCreateRequest = await this.didUserCreateRequest(userId, requestId);
        if(!didUserCreateRequest) return StatusCodes.FORBIDDEN;
        const didRequestUpdate = await this.repository().updateRequest(requestId, requestBody)
        if(!didRequestUpdate) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.OK;

    }


    /**
     * Accepts a request to fulfill the service
     * @param {number} requestId - ID of the request to accept
     * @param {string} userId - ID of the user accepting the request
     * @returns {Promise<StatusCodes>} Status code indicating result of operation
     *
     * @throws {404} NOT_FOUND - When request doesn't exist
     * @throws {403} FORBIDDEN - When user is creator or request already accepted
     * @throws {500} INTERNAL_SERVER_ERROR - When acceptance fails
     */
    public async acceptRequest(requestId: number, userId: string): Promise<StatusCodes> {
        const originalRequest = await this.repository().getRequestById(requestId);
        if(originalRequest === undefined)        return StatusCodes.INTERNAL_SERVER_ERROR;
        if(originalRequest === null)             return StatusCodes.NOT_FOUND;
        if(originalRequest.creator == userId)   return StatusCodes.FORBIDDEN;
        if(originalRequest.accepted_by != null) return StatusCodes.FORBIDDEN;

        const result = await this.repository().acceptRequest(requestId, userId);
        if(!result) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.OK;
    }

    /**
     * Retrieves a specific request by ID
     * @param {number} requestId - ID of the request to retrieve
     * @returns {Promise<Object|StatusCodes>} Request object or status code
     *
     * @throws {404} NOT_FOUND - When request doesn't exist
     * @throws {500} INTERNAL_SERVER_ERROR - When retrieval fails
     */
    public async getRequest(requestId: number){
        const originalRequest = await this.repository().getRequestById(requestId);
        if(originalRequest === undefined)        return StatusCodes.INTERNAL_SERVER_ERROR;
        if(originalRequest === null)             return StatusCodes.NOT_FOUND;
        return originalRequest;
    }

    /**
     * Retrieves open requests near user's location
     * @param {string} userId - ID of the user
     * @param {number} userPlz - User's postal code (PLZ)
     * @returns {Promise<Array<Object>|StatusCodes>} Array of nearby requests or status code
     *
     * @throws {500} INTERNAL_SERVER_ERROR - When retrieval fails
     *
     * @remarks
     * Filters by first 3 digits of PLZ and excludes user's own requests
     */
    public async getRequestsNearby(userId: string, userPlz: number){
        const results = await this.repository().getOpenRequestsNearbyForPlz(userPlz)
        if(results == undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        const ownRequestsOfUser = await this.repository().getAllUserRequests(userId);
        if(ownRequestsOfUser == undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        const ownRequestsOfUserIds = ownRequestsOfUser.map(request => request.id);
        return results.filter(request => !ownRequestsOfUserIds.includes(request.id));

    }

    /**
     * Retrieves all requests for a specific user
     * @param {string} userId - ID of the user
     * @returns {Promise<Array<Object>|StatusCodes>} Array of user's requests or status code
     *
     * @throws {500} INTERNAL_SERVER_ERROR - When retrieval fails
     */
    public async getRequestsForUser(userId: string) {
        const results = await this.repository().getAllUserRequests(userId);
        if(results === undefined) return StatusCodes.INTERNAL_SERVER_ERROR;
        if(results === null) return [];
        return results;
    }

    /**
     * Checks if user can create a new request based on pending request limit
     * @private
     * @param {string} userId - ID of the user to check
     * @returns {Promise<boolean>} True if user can create request, false otherwise
     */
    private async canUserCreateRequest(userId: string): Promise<boolean> {
        const pendingReqForUser = await this.repository().getAllUserRequests(userId)
        if(pendingReqForUser == undefined) return false;
        return pendingReqForUser.length < RequestService.USER_MAX_PENDING_REQUESTS;
    }

    private async hasUserEnoughCredits(userId: string, userBalance: number, credditsNeeded: number) {
        const pendingUserRequests = await this.repository().getAllUserRequests(userId);
        if(!pendingUserRequests) return false;
        const totalCredits = pendingUserRequests.reduce((sum, req) => sum + req.credits, 0);
        return totalCredits + credditsNeeded <= userBalance
    }

    /**
     * Verifies if user created a specific request
     * @private
     * @param {string} userId - ID of the user to check
     * @param {number} requestId - ID of the request to verify
     * @returns {Promise<boolean>} True if user created the request, false otherwise
     */
    private async didUserCreateRequest(userId: string, requestId: number): Promise<boolean> {
        const pendingReqForUser = await this.repository().getAllUserRequests(userId);
        if(pendingReqForUser == undefined) return false;
        return pendingReqForUser.filter(req => req.id == requestId).length > 0
    }

    public async finishRequest(userId: string, requestId: number) {
        const didUserCreateRequest = await this.didUserCreateRequest(userId, requestId);
        if(!didUserCreateRequest) {
            logger.debug(`Cannot finish request, user=${userId} is not the creator!`)
            return StatusCodes.FORBIDDEN;
        }

        const request = await this.getRequest(requestId);
        if(typeof(request) == "number") {
            logger.debug(`Unable to finish request because it could not be found, code=${request}`)
            return request;
        }

        const recipient = request.accepted_by;
        if(!recipient) {
            logger.debug(`Unable to finish reuqest because it was not accepted yet, accepted_by = null`)
            return StatusCodes.CONFLICT
        };

        const transferResult = await this.userService.transferMoney(userId, recipient, request.credits)
        if(transferResult != StatusCodes.OK) {
            logger.debug(`Unable to finish request because money transfer failed, code=${transferResult}`)
            return transferResult;
        }
        const result = await this.deleteRequest(userId, requestId);
        if(result != StatusCodes.OK) {
            logger.debug(`Unable to delete finished request with id=${requestId}`)
            return result
        };
        return {
            from: userId,
            to: recipient,
            amount: request.credits
        };
    }
}
export default RequestService;
