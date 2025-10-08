import {drizzle} from "drizzle-orm/mysql2";


if(process.env.DATABASE_URL == undefined) throw new Error("Missing database URL");

const db = drizzle(process.env.DATABASE_URL ?? "")
