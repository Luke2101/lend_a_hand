import type {AuthenticatedRequest} from "../types.js";
import type {Response} from "express";
import FavouriteService from "../services/FavouriteService.js";
import {StatusCodes} from "http-status-codes";
import type {UpdateQueryParams} from "../schemas/requestSchemas.js";

class FavouriteController {

    private static favouriteService = new FavouriteService();


    /**
     * Retrieves all favourite/interested requests for the authenticated user.
     *
     * @param {AuthenticatedRequest} req - Express request object with authenticated user info (`req.user`).
     * @param {Response} res - Express response object used to send back HTTP responses.
     *
     * @returns {Promise<void>} Sends HTTP responses:
     *  - 200 OK: Successfully retrieved user's favourite requests.
     *    Example response:
     *    ```json
     *    [1,66,32,2,12,98,5]
     *    ```
     *  - 500 Internal Server Error: Error retrieving the user's favourites.
     */
    public static async get(req: AuthenticatedRequest, res: Response) {
        const result = await FavouriteController.favouriteService.getInterestsForUser(req.user.id)
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
        return res.status(StatusCodes.OK).send(result);
    }

    /**
     * Removes a request from the authenticated user's favourites.
     *
     * @param {AuthenticatedRequest<{},{},{},UpdateQueryParams>} req - Express request object containing the request ID to remove (`req.query.id`) and authenticated user info.
     * @param {Response} res - Express response object used to send back HTTP responses.
     *
     * @returns {Promise<void>} Sends HTTP responses:
     *  - 200 OK: Successfully removed the request from favourites.
     *  - 404 Not Found: Request does not exist in user's favourites.
     *  - 500 Internal Server Error: Error during removal.
     */
    public static async remove(req: AuthenticatedRequest<{},{},{},UpdateQueryParams>, res: Response) {
        const resultStatusCode = await FavouriteController.favouriteService.removeInterest(req.user.id, req.query.id);
        return res.status(resultStatusCode).send();
    }

    /**
     * Adds a request to the authenticated user's favourites.
     *
     * @param {AuthenticatedRequest<{},{},{},UpdateQueryParams>} req - Express request object containing the request ID to add (`req.query.id`) and authenticated user info.
     * @param {Response} res - Express response object used to send back HTTP responses.
     *
     * @returns {Promise<void>} Sends HTTP responses:
     *  - 201 Created: Request successfully added to favourites.
     *  - 409 Conflict: Request is already in the user's favourites.
     *  - 404 Not Found: Request does not exist.
     *  - 500 Internal Server Error: Error during addition.
     */
    public static async add(req: AuthenticatedRequest<{},{},{},UpdateQueryParams>, res: Response) {
        const resultStatusCode = await FavouriteController.favouriteService.addInterest(req.user.id, req.query.id);
        return res.status(resultStatusCode).send();
    }
}

export default FavouriteController;