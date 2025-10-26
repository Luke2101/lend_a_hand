import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {drizzle} from "drizzle-orm/mysql2";
import {account, session, user, verification} from "../db/auth-schema.js";
import {admin} from "better-auth/plugins";
import {favouriteTable, requestTable} from "../db/tables.js";
import DatabaseError from "../errors/DatabaseError.js";

if(process.env.DB_USER == undefined) throw new DatabaseError("Missing database user in config");
if(process.env.DB_NAME == undefined) throw new DatabaseError("Missing database name in config");
if(process.env.DB_HOST == undefined) throw new DatabaseError("Missing database host in config");
export const db = drizzle(`mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`)

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: {
            user,
            session,
            account,
            verification,
            requestTable,
            favouriteTable
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
    plugins: []
})