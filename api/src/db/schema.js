import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
export const usersTable = mysqlTable('users', {
    id: serial().primaryKey(),
    prename: varchar({ length: 256 }).notNull(),
    surname: varchar({ length: 256 }).notNull(),
    plz: int().notNull(),
    email: varchar({ length: 256 }).notNull().unique(),
    password: varchar({ length: 256 }).notNull(),
});
