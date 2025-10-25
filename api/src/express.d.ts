import type {CUser} from "./types.js";

declare global {
    namespace Express {
        export interface Request {
            session?: Session;
            user?: CUser
        }
    }
}

export {}