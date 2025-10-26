import {db} from "../../lib/auth.js";
import {favouriteTable} from "../tables.js";
import {and, eq} from "drizzle-orm";
import logger from "../../util/logger.js";

class FavouriteOperations {

    public static async getInterestsForUserById(uId: string) {
        try {
            const result = await db.select({id: favouriteTable.requestId})
                .from(favouriteTable)
                .where(eq(favouriteTable.userId, uId));
            return result.map(entry => entry.id)
        }catch (err) {
            logger.error(err);
            return undefined;
        }

    }

    public static async addRequestToInterests(reqId: number, uId: string) {
        try {
            const result = await db.insert(favouriteTable).values({
                requestId: reqId,
                userId: uId
            });
            return true;
        }catch (e) {
            logger.error(e);
            return false;
        }
    }

    public static async removeInterestInRequestForUser(reqId: number, uId: string) {
        try {
            const result = await db
                .delete(favouriteTable)
                .where(and(eq(favouriteTable.userId, uId), eq(favouriteTable.requestId, reqId)));

            return result[0].affectedRows == 1;
        }catch (e) {
            logger.error(e);
            return false;
        }
    }

}

export default FavouriteOperations;