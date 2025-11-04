import { StatusCodes } from "http-status-codes";
import UserSerivce from "../services/UserService.js";
import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../types.js";
import type { UpdateUserBody } from "../schemas/userSchemas.js";
import UserService from "../services/UserService.js";
import logger from "../util/logger.js";
import type {IdParam, IdParamString} from "../schemas/requestSchemas.js";

/**
 * @class UserController
 * @classdesc Controller handling user-related operations including authentication,
 * profile management, and user information retrieval
 *
 * @property {UserService} userService - Service instance handling business logic for user operations
 */
class UserController {
    private static userService: UserService

    public static setUserService(us: UserService){
        logger.debug(`Set user service to ${us}`)
        this.userService = us;
    }

    /**
     * Logs out the authenticated user
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response with no content and logout headers
     *
     * @remarks
     * Clears authentication cookies and session via Better Auth
     *
     * @example
     * POST /api/auth/logout
     */
    public static async logout(req: Request, res: Response): Promise<Response> {
        const result = await UserController.userService.logout(req)
        return res.setHeaders(result).status(StatusCodes.NO_CONTENT).send();
    }

    /**
     * Retrieves authenticated user's information
     * @param {AuthenticatedRequest} req - Authenticated request containing user data
     * @param {Response} res - Express response object
     * @returns {Response} Response with user information
     *
     * @example
     *  GET /api/user/info
     *  Response: { id: "user-123", email: "user@example.com", ... }
     */
    public static async info(req: AuthenticatedRequest, res: Response) {
        const result = await this.userService.getDeepInfoForUser(req.user.id);
        if(result == StatusCodes.NOT_FOUND) return res.status(StatusCodes.NOT_FOUND).send({message: "USER_NOT_FOUND"})
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.NOT_FOUND).send()
        return res.status(StatusCodes.OK).send(result)
    }

    /**
     * Updates user profile information
     * @param {AuthenticatedRequest<{},{},UpdateUserBody>} req - Authenticated request with update data
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} Response indicating success or failure of update
     *
     * @throws {400} BAD_REQUEST - When request body is empty
     * @throws {500} INTERNAL_SERVER_ERROR - When update fails due to server error
     *
     * @example
     * PATCH /api/user/profile
     * Request body: { prename: "John", surname: "Doe", city: "Berlin", ... }
     */
    public static async update(req: AuthenticatedRequest<{},{},UpdateUserBody>, res: Response): Promise<Response> {
        const result = await UserController.userService.updateProfile(req.session,req.body);
        if(result == StatusCodes.BAD_REQUEST) return res.status(StatusCodes.BAD_REQUEST).send();
        if(result == StatusCodes.INTERNAL_SERVER_ERROR) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
        return res.status(StatusCodes.OK).send({message: "USER_UPDATED"})
    }

    public static async get(req: AuthenticatedRequest<{},{}, {},IdParamString>, res: Response) {
        const result = await UserController.userService.getInfoForUser(req.query.id)
        if(result == StatusCodes.NOT_FOUND) return res.status(StatusCodes.NOT_FOUND).send({message: "USER_NOT_FOUND"})
        return res.status(StatusCodes.OK).send(result);
    }

    public static async delete(req: AuthenticatedRequest, res: Response) {
        const result = await UserController.userService.deleteUser(req.user.id);
        return res.status(result).send()

    }
}

export default UserController;