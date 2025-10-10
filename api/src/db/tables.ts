import {mysqlTable, varchar} from "drizzle-orm/mysql-core";

export const userTable = mysqlTable("cream", {
    name: varchar({length: 256})
})