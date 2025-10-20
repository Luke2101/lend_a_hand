import {type TUser} from "../fixtures/users.js";
import {auth, db} from "../../src/lib/auth.js";
import DatabaseError from "../../src/errors/DatabaseError.js";
import {user} from "../../src/db/auth-schema.js";
import {eq} from "drizzle-orm";

export async function prepareUsers(...users: TUser[]){
    const userIds: string[] = []
    for(const user of users) {
        const result = await auth.api.signUpEmail({
            body: user
        })
        if(!result || !result.user) {
            throw new DatabaseError(`Unable to create test user`)
        }

        userIds.push(result.user.id)
    }
    return userIds;
}

export async function deleteUsers(...userIds: string[]) {
    for(const userId of userIds) {
        await db.delete(user).where(eq(user.id, userId))
    }
}

export async function deleteUserByMail(email: string) {
    await db.delete(user).where(eq(user.email, email));
}