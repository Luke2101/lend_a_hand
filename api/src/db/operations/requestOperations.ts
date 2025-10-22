import type {CreateRequestBody} from "../../schemas/requestSchemas.js";
import {db} from "../../lib/auth.js";
import {requestTable} from "../tables.js";
import logger from "../../util/logger.js";
import type {User} from "better-auth";
import {eq} from "drizzle-orm";


class RequestOperations {
    public static async createRequest(reqData: CreateRequestBody, creator: string){
        try {
            const result = await db.insert(requestTable).values({
                ...reqData,
                creator: creator,
                from: reqData.from ? new Date(reqData.from) : undefined,
                to: reqData.to ? new Date(reqData.to) : undefined,
            });
            return {
                ...reqData,
                id: result[0].insertId,
            };
        }catch (err) {
            logger.error(`Unable to create request req=${JSON.stringify(reqData)}`)
            return undefined;
        }

    }

    public static async getAllUserRequests(user: User) {
        try {
            return await db.select().from(requestTable).where(eq(requestTable.creator, user.id))
        }catch (err) {
            return undefined;
        }
    }

    public static async deleteRequest(reqId: number) {
        try {
            await db.delete(requestTable).where(eq(requestTable.id, reqId))
            return true;
        }catch (err) {
            logger.error(`Unable to delete request with id=${reqId}`)
            return false;
        }
    }
}

export default RequestOperations;