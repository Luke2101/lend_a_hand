import {StatusCodes} from "http-status-codes";
import RequestService from "../services/RequestService.js";
import type {Request, Response} from "express";
import type {CreateRequestBody, UpdateQueryParams} from "../schemas/requestSchemas.js";
import type {AuthenticatedRequest} from "../types.js";

/**
 * @class RequestController
 * @classdesc Controller handling all request-related operations including creation,
 * modification, deletion, and retrieval of service requests
 *
 * @property {RequestService} requestService - Service instance handling business logic for requests
 */
class RequestController {

    private static requestService = new RequestService();

    /**
     * Creates a new service request
     * @param {AuthenticatedRequest<{},{},CreateRequestBody>} req - Authenticated request containing request data
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response with created request data or error message
     *
     * @throws {500} INTERNAL_SERVER_ERROR - When request creation fails due to server error
     * @throws {403} FORBIDDEN - When user has reached maximum pending requests limit
     *
     * @example
     * // Request body
     * {
     *   "title": "Help with groceries",
     *   "category": "shopping",
     *   "credits": 5,
     *   "description": "Need help buying groceries",
     *   "from": "2023-12-01T10:00:00Z",
     *   "to": "2023-12-01T12:00:00Z"
     * }
     */
    public static async create(req: AuthenticatedRequest<{},{},CreateRequestBody>, res: Response) {
        const result = await RequestController.requestService.createRequest(req.user.id, req.body);
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        if(result == StatusCodes.FORBIDDEN) return res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_LIMIT_REACHED"})
        return res.status(StatusCodes.CREATED).send(result);
    }

    /**
     * Deletes a specific request
     * @param {AuthenticatedRequest<{},{}, {},UpdateQueryParams>} req - Authenticated request with request ID in query params
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response indicating success or failure of deletion
     *
     * @throws {403} FORBIDDEN - When user is not the creator of the request
     * @throws {500} INTERNAL_SERVER_ERROR - When deletion fails due to server error
     *
     * @example
     * // DELETE /api/requests?id=123
     */
    public static async delete(req: AuthenticatedRequest<{},{}, {},UpdateQueryParams>, res: Response) {
        const result = await RequestController.requestService.deleteRequest(req.user.id,req.query.id)
        if(result == StatusCodes.FORBIDDEN) return res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_CREATOR_TOKEN_MISMATCH"});
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "ERROR_DURING_DELETION"})
        return res.status(result).send({message: "DELETED"})
    }

    /**
     * Updates an existing request
     * @param {AuthenticatedRequest<{}, {}, CreateRequestBody, UpdateQueryParams>} req - Authenticated request with update data and request ID
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response indicating success or failure of update
     *
     * @throws {403} FORBIDDEN - When user is not the creator of the request
     * @throws {500} INTERNAL_SERVER_ERROR - When update fails due to server error
     *
     * @example
     * // PUT /api/requests?id=123
     * // Request body same as create
     */
    public static async update(req: AuthenticatedRequest<{}, {}, CreateRequestBody, UpdateQueryParams>, res: Response) {
        const result = await RequestController.requestService.updateRequest(req.query.id, req.user.id, req.body)
        if(result == StatusCodes.FORBIDDEN) return res.status(StatusCodes.FORBIDDEN).send({message: "REQUEST_CREATOR_TOKEN_MISMATCH"});
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({message: "UNABLE_TO_UPDATE_REQUEST"});
        if(result == StatusCodes.OK) return res.status(StatusCodes.OK).send({message: "REQUEST_UPDATED"});
    }

    /**
     * Accepts a request to fulfill the service
     * @param {AuthenticatedRequest<{},{}, {},UpdateQueryParams>} req - Authenticated request with request ID in query params
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response indicating success or failure of acceptance
     *
     * @throws {404} NOT_FOUND - When the specified request doesn't exist
     * @throws {403} FORBIDDEN - When user cannot accept the request (creator or already accepted)
     * @throws {500} INTERNAL_SERVER_ERROR - When acceptance fails due to server error
     *
     * @example
     * // POST /api/requests/accept?id=123
     */
    public static async accept(req: AuthenticatedRequest<{},{}, {},UpdateQueryParams>, res: Response) {
        const result: StatusCodes = await RequestController.requestService.acceptRequest(req.query.id,req.user.id);
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        if(result == StatusCodes.NOT_FOUND) return res.status(StatusCodes.NOT_FOUND).send({message: "REQUEST_NOT_FOUND"});
        if(result == StatusCodes.FORBIDDEN) return res.status(StatusCodes.FORBIDDEN).send({message: "FORBIDDEN_TO_ACCEPT_REQUEST"})
        return res.status(StatusCodes.OK).send({message: "REQUEST_ACCEPTED", id: req.query.id})
    }

    /**
     * Retrieves a specific request by ID
     * @param {Request<{},{}, {},UpdateQueryParams>} req - Request with request ID in query params
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response with request data or error message
     *
     * @throws {404} NOT_FOUND - When the specified request doesn't exist
     * @throws {500} INTERNAL_SERVER_ERROR - When retrieval fails due to server error
     *
     * @example
     * // GET /api/requests?id=123
     */
    public static async get(req: Request<{},{}, {},UpdateQueryParams>, res: Response) {
        const result = await RequestController.requestService.getRequest(req.query.id)
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        if(result == StatusCodes.NOT_FOUND) return res.status(StatusCodes.NOT_FOUND).send({message: "REQUEST_NOT_FOUND"})
        return res.status(StatusCodes.OK).send(result);
    }

    /**
     * Retrieves open requests near the user's location
     * @param {AuthenticatedRequest} req - Authenticated request with user data
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response with array of nearby requests
     *
     * @throws {500} INTERNAL_SERVER_ERROR - When retrieval fails due to server error
     *
     * @remarks
     * Filters out requests created by the user themselves and uses PLZ (Postleitzahl)
     * for geographical proximity matching
     */
    public static async nearby(req: AuthenticatedRequest, res: Response) {
        const result = await RequestController.requestService.getRequestsNearby(req.user.id,req.user.plz);
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
        return res.status(StatusCodes.OK).send(result);
    }

    /**
     * Retrieves all requests created by the authenticated user
     * @param {AuthenticatedRequest} req - Authenticated request with user data
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response with array of user's requests
     *
     * @throws {500} INTERNAL_SERVER_ERROR - When retrieval fails due to server error
     *
     * @example
     * GET /api/requests/self
     */
    public static async self(req: AuthenticatedRequest, res: Response){
        const result = await RequestController.requestService.getRequestsForUser(req.user.id);
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        return res.status(StatusCodes.OK).send(result);
    }


}

export default RequestController;