import type {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {auth, db} from "../lib/auth.js";
import {fromNodeHeaders} from "better-auth/node";
import type {UpdateUserBody} from "../schemas/userSchemas.js";
import {type Session} from "better-auth";
import {eq} from "drizzle-orm";
import {user} from "../db/auth-schema.js";
import logger from "../util/logger.js";
import UserOperations from "../db/operations/userOperations.js";


class UserSerivce {

    public static async logout(req: Request,) {
        const headers = fromNodeHeaders(req.headers);
        const response = await auth.api.signOut({headers, asResponse: true})
        return response.headers;

    }

    public static async updateProfile(session: Session, requestBody: UpdateUserBody) {
        if(Object.keys(requestBody).length == 0) return StatusCodes.BAD_REQUEST;
        const result = await UserOperations.updateUser(requestBody,session.userId);
        if(!result) return StatusCodes.INTERNAL_SERVER_ERROR;
        return StatusCodes.OK;
    }
}
export default UserSerivce;
