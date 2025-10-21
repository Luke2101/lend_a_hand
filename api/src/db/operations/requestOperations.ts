import type {CreateRequestBody} from "../../schemas/requestSchemas.js";
import {db} from "../../lib/auth.js";
import {requestTable} from "../tables.js";
import logger from "../../util/logger.js";
import type {User} from "better-auth";
import {eq} from "drizzle-orm";

class RequestOperations {
    public static async createRequest(reqData: CreateRequestBody, creator: string): Promise<boolean>{
        try {
            const result = await db.insert(requestTable).values({
                ...reqData,
                creator: creator,
                from: new Date(reqData.from),
                to: new Date(reqData.to),
            });

            return true;
        }catch (err) {
            logger.error(`Unable to create request req=${JSON.stringify(reqData)}`)
            return false;
        }

    }

    public static async getAllUserRequests(user: User) {
        try {
            return await db.select().from(requestTable).where(eq(requestTable.creator, user.id))
        }catch (err) {
            return undefined;
        }
    }
}

export default RequestOperations;