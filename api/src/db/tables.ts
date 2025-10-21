import { mysqlTable, varchar, int, text, datetime } from "drizzle-orm/mysql-core";
import { user } from "./auth-schema.js";



export const requestTable = mysqlTable("request", {
    id:int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    credits: int("credits").notNull(), 
    description: text("description").notNull(),
    creator: varchar("creator", {length: 36}).references(() => user.id ),
    from: datetime("from"),
    to: datetime("to"),
});
