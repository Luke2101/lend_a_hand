import type {SignUpBody} from "../../src/schemas/authSchemas.js";
import request from "supertest";
import {app} from "../../src/api.js";
import {db} from "../../src/lib/auth.js";
import {user} from "../../src/db/auth-schema.js";
import {eq} from "drizzle-orm";
import type {TUser} from "../fixtures/users.js";
import {fromNodeHeaders} from "better-auth/node";
import type {CreateRequestBody} from "../../src/schemas/requestSchemas.js";
import TestingError from "../../src/errors/TestingError.js";

class AdminTools {
    public static async createUser(userData: SignUpBody, balance?: number) {
        const res = await request(app).post("/auth/signup").send(userData);
        return res.ok;
    }

    public static async setBalance(email: string, balance: number) {
        const r = await db.update(user).set({balance: balance}).where(eq(user.email, email))
        return r[0].affectedRows == 1;
    }
    public static async deleteUserByMail(email: string) {
        await db.delete(user).where(eq(user.email, email));
    }

    public static async loginAndRetrieveSession(user: TUser) {
        const res = await request(app).post("/auth/login").send({
            email: user.email,
            password: user.password,
        });
        if(!res.ok) throw new TestingError(`Error while logging in and retrieving session for user=${user.email}`)
        const headers = fromNodeHeaders(res.headers);
        return headers.getSetCookie();
    }

    public static async createSampleRequest(req: CreateRequestBody, token: string[]) {
        const result = await request(app).post("/request").set("Cookie",token).send(req)
        if(!result.ok) throw new TestingError(`Error while creating sample request req=[${JSON.stringify(req)}]`)
        return result.body;
    }

}

export default AdminTools;