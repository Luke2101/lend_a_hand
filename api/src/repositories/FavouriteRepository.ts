import {db} from "../lib/auth.js";
import {favouriteTable} from "../db/tables.js";
import {and, eq} from "drizzle-orm";
import logger from "../util/logger.js";

class FavouriteRepository {

    public async getInterestsForUserById(uId: string) {
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

    public async addRequestToInterests(reqId: number, uId: string) {
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

    public async removeInterestInRequestForUser(reqId: number, uId: string) {
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

export default FavouriteRepository;