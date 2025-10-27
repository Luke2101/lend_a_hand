import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
//@ts-ignore
import DatabaseError from "./src/errors/DatabaseError.ts";
if(process.env.DB_USER == undefined) throw new DatabaseError("Missing database user in config");
if(process.env.DB_NAME == undefined) throw new DatabaseError("Missing database name in config");
if(process.env.DB_HOST == undefined) throw new DatabaseError("Missing database host in config");
if(process.env.DB_PORT == undefined) throw new DatabaseError("Missing database port in config");

const url = `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: url,
    },
});
