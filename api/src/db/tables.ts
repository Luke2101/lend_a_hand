import {mysqlTable, varchar, int, text, datetime, timestamp, mysqlEnum} from "drizzle-orm/mysql-core";




export const requestTable = mysqlTable("request", {
    id:int("id").primaryKey().autoincrement().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    category: mysqlEnum("category", ["help", "giveaway", "rent"]),
    credits: int("credits").notNull(),
    description: text("description"),
    creator: varchar("creator", {length: 36}).notNull(),
    accepted_by: varchar("accepted_by", {length: 36}),
    from: datetime("from"),
    to: datetime("to"),
});

export const favouriteTable = mysqlTable("interested", {
    id: int("id").primaryKey().autoincrement().notNull(),
    userId: varchar("uId", {length: 36}).notNull(),
    requestId: int("requestId").notNull(),
    added_at: timestamp("added_at").defaultNow().notNull()
})

export const transactionsTable = mysqlTable("transactions", {
    id: int("id").primaryKey().autoincrement().notNull(),
    from_account: varchar("from_account", {length: 36}).notNull(),
    to_account: varchar("to_account", {length: 36}).notNull(),
    amount: int("amount").notNull(),
    created_at: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
})

