import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {drizzle} from "drizzle-orm/mysql2";
import {account, session, user, verification} from "../db/auth-schema.js";
import {admin} from "better-auth/plugins";
import {requestTable} from "../db/tables.js";

if(process.env.DATABASE_URL == undefined) throw new Error("Missing database URL");
export const db = drizzle(process.env.DATABASE_URL)

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: {
            user,
            session,
            account,
            verification,
            requestTable
        }
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
    },
    session: {
        expiresIn: 60 * 60 * 3,
    },
    user: {
        deleteUser: {
            enabled: true
        },
        additionalFields: {
            prename: { type: "string", required: true },
            surname: { type: "string", required: true },
            plz: { type: "number" , required: true },
            street: { type: "string" , required: true },
            houseNumber: { type: "string" , required: true },
            city: { type: "string" , required: true },
        }
    },
    plugins: [
        //admin()
    ]
})