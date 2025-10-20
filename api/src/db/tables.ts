import { mysqlTable, varchar, int, text, datetime } from "drizzle-orm/mysql-core";
//@ts-ignore
import { user } from "./auth-schema.ts"; // Pfad zu deiner user-Tabelle
export const requestTable = mysqlTable("request", {
    id:int("id").primaryKey().autoincrement(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    credits: int("credits").notNull(), // Ganzzahl
    description: text("description").notNull(),
    creator: varchar("creator", {length: 36}).references(() => user.id ),
    from: datetime("from"),
    to: datetime("to"),
});
