import type { Request } from "express";
import { StatusCodes } from "http-status-codes";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { UpdateUserBody } from "../schemas/userSchemas.js";
import { type Session } from "better-auth";
import UserRepository from "../repositories/UserRepository.js";
import Service from "./Service.js";
import type {UserModel} from "../types.js";
import TransactionService from "./TransactionService.js";

/**
 * @class UserService
 * @classdesc Service layer handling business logic for user operations
 * @extends Service<UserRepository>
 *
 * @description
 * Manages user authentication, profile updates, and session management
 * using Better Auth for authentication flows.
 */
class UserSerivce extends Service<UserRepository>{
    /**
     * Creates a new user service instance
     */
    constructor() {
        super(new UserRepository())
    }

    private transactionService = new TransactionService();

    /**
     * Handles user logout process
     * @param {Request} req - Express request object containing headers
     * @returns {Promise<Headers>} Response headers for clearing authentication
     *
     * @remarks
     * Uses Better Auth API to invalidate session and clear cookies
     *
     * @example
     * const headers = await userService.logout(req);
     * res.setHeaders(headers);
     */
    public async logout(req: Request,): Promise<Headers> {
        const headers = fromNodeHeaders(req.headers);
        const response = await auth.api.signOut({headers, asResponse: true})
        return response.headers;
    }

    /**
     * Updates user profile information
     * @param {Session} session - User session object
     * @param {UpdateUserBody} requestBody - Data to update user profile
     * @returns {Promise<StatusCodes>} Status code indicating result of operation
     *
     * @throws {400} BAD_REQUEST - When request body is empty
     * @throws {500} INTERNAL_SERVER_ERROR - When update fails due to database error
     *
     * @example
     * await updateProfile(session, { prename: "John", city: "Hamburg" });
     */
    public async updateProfile(session: Session, requestBody: UpdateUserBody): Promise<StatusCodes> {
        if(Object.keys(requestBody).length == 0) return StatusCodes.BAD_REQUEST;
        const result = await this.repository().updateUser(requestBody,session.userId);
        if(!result) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.OK;
    }

    public async transferMoney(fromAccount: string, toAccount: string, amount: number) {
        const sender = await this.repository().getUserById(fromAccount);
        if(!sender) return StatusCodes.NOT_FOUND;
        if(sender.balance < amount) return StatusCodes.PAYMENT_REQUIRED;
        const doesToAccountExist = await this.doesUserExist(toAccount)
        if(!doesToAccountExist) return StatusCodes.NOT_FOUND;
        const moneySuccessfullyRemoved = await this.repository().removeMoneyFromAccount(sender.id, amount);
        if(!moneySuccessfullyRemoved) return StatusCodes.INTERNAL_SERVER_ERROR;
        const moneyAddedSuccessfully = await this.repository().addMoneyToAccount(toAccount, amount);
        if(!moneyAddedSuccessfully) return StatusCodes.INTERNAL_SERVER_ERROR;
        await this.transactionService.logTransaction({fromAccount: sender.id, toAccount: toAccount, amount: amount})
        return StatusCodes.OK;
    }
    //TODO GET REQUEST FOR USER INFO

    private async doesUserExist(userId: string) {
        return this.repository().checkIfUserExists(userId)
    }

}

export default UserSerivce;