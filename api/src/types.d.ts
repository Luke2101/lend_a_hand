import type {user} from "./db/auth-schema.js";
import type {InferInsertModel, InferSelectModel} from "drizzle-orm";
import type {requestTable} from "./db/tables.js";
import {Request} from "express";

export type AuthenticatedRequest<
    Params = {},
    ResBody = any,
    ReqBody = any,
    ReqQuery = any
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
    user: CUser;       // non-optional
    session: any;     // optional, type as needed
};

export type SRequest = {
    id: number;
    title: string;
    category: string;
    credits: number;
    description?: string;
    from?: string;
    to?: string;
}

export type CUser = InferInsertModel<typeof user>;
export type CRequest = InferSelectModel<typeof requestTable>;