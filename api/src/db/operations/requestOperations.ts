import type {CreateRequestBody} from "../../schemas/requestSchemas.js";
import {db} from "../../lib/auth.js";
import {requestTable} from "../tables.js";
import logger from "../../util/logger.js";
import type {User} from "better-auth";
import {and, eq, isNull, like} from "drizzle-orm";
import type {SRequest} from "../../types.js";
import {user} from "../auth-schema.js";


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

    public static async getAllUserRequests(userId: string) {
        try {
            return await db.select().from(requestTable).where(eq(requestTable.creator, userId))
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

    public static async updateRequest(reqData: SRequest) {
        try {
            const result = await db.update(requestTable).set({
                title: reqData.title,
                category: reqData.category,
                credits: reqData.credits,
                description: reqData.description,
                from: reqData.from ? new Date(reqData.from) : undefined,
                to: reqData.to ? new Date(reqData.to) : undefined,
            }).where(eq(requestTable.id, reqData.id))

            return true;
        }catch (err) {
            logger.error(`Unable to delete request with id=${reqData.id}`)
            return false;
        }
    }

    public static async getRequestById(reqId: number) {
        try {
            const result = await db.select().from(requestTable).where(eq(requestTable.id, reqId));

            if(result.length == 0) {
                logger.warn(`Unable to get request with id=${reqId} as it doesn't exist!`)
                return null;
            }

            return result[0];
        } catch (err) {
            logger.error(`Unable to get request from db for requestId=${reqId}`)
            return undefined;
        }
    }

    public static async acceptRequest(reqId: number, userId: any) {
        try {
            const result = await db.update(requestTable).set({
                accepted_by: userId
            }).where(eq(requestTable.id, reqId));

            return result[0].affectedRows > 0;
        } catch (err) {
            logger.error(`Unable to accept request with requestId=${reqId}`)
            return false;
        }
    }

    public static async getOpenRequestsNearbyForPlz(plz: number) {
        try {
            const firstThreePlzDigits = plz.toString().slice(0,3)
            return await db.select(
                {
                    id: requestTable.id,
                    title: requestTable.title,
                    description: requestTable.description,
                    credits: requestTable.credits,
                    category: requestTable.category,
                    creator: requestTable.creator,
                    from: requestTable.from,
                    to: requestTable.to,
                    city: user.city,
                    plz: user.plz
                }
            )
                .from(requestTable)
                .innerJoin(user, eq(user.id, requestTable.creator))
                .where(
                    and(
                        like(user.plz, `${firstThreePlzDigits}%`),
                        isNull(requestTable.accepted_by)
                    )
                );
        } catch (err) {
            logger.error(`Unable to get requests for plz=${plz}`)
            return undefined;
        }
    }
}

export default RequestOperations;