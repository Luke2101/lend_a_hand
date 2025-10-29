import type {CUser, UserModel} from "./types.js";

declare global {
    namespace Express {
        export interface Request {
            session?: Session;
            user?: UserModel
        }
    }
}

export {}