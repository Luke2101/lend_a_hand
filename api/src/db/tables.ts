import { mysqlTable, varchar, int, text, datetime } from "drizzle-orm/mysql-core";



export const requestTable = mysqlTable("request", {
    id:int("id").primaryKey().autoincrement().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 255 }).notNull(),
    credits: int("credits").notNull(), 
    description: text("description"),
    creator: varchar("creator", {length: 36}).notNull(),
    from: datetime("from"),
    to: datetime("to"),
});
