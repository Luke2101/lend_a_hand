import type {SignUpBody} from "../../src/schemas/authSchemas.js";
import request from "supertest";
import {app} from "../../src/api.js";
import {db} from "../../src/lib/auth.js";
import {user} from "../../src/db/auth-schema.js";
import {eq} from "drizzle-orm";
import type {TUser} from "../fixtures/users.js";
import {fromNodeHeaders} from "better-auth/node";
import {requestTable} from "../../src/db/tables.js";
import type {InsertRequest, SRequest} from "../../src/types.js";

class AdminTools {
    public static async createUser(userData: SignUpBody) {
        const res = await request(app).post("/auth/signup").send(userData);
        return res.ok
    }

    public static async deleteUserByMail(email: string) {
        await db.delete(user).where(eq(user.email, email));
    }

    public static async loginAndRetrieveSession(user: TUser) {
        const res = await request(app).post("/auth/login").send({
            email: user.email,
            password: user.password,
        });
        const headers = fromNodeHeaders(res.headers);
        return headers.getSetCookie();
    }

    public static async createRequest(request: InsertRequest) {
        const result = await db.insert(requestTable).values(request)
    }

}

export default AdminTools;