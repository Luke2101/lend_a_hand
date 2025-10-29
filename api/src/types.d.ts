import type {user} from "./db/auth-schema.js";
import type {InferInsertModel, InferSelectModel} from "drizzle-orm";
import {type requestTable, transactionsTable} from "./db/tables.js";
import {Request} from "express";
import type RequestCategory from "./util/RequestCategory.js";

export type AuthenticatedRequest<
    Params = {},
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
    user: UserModel;       // non-optional
    session: any;     // optional, type as needed
};

export type SRequest = {
    id: number;
    title: string;
    category: RequestCategory;
    credits: number;
    description?: string;
    from?: string;
    to?: string;
}

export type TransactionRequest = {
    fromAccount: string,
    toAccount: string,
    amount: number
}

type InsertRequest = typeof requestTable.$inferInsert;
export type UserModel = InferSelectModel<typeof user>;
export type CRequest = InferSelectModel<typeof requestTable>;