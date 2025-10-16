import type {User} from "better-auth";

declare global {
    namespace Express {
        export interface Request {
            session?: Session;
            user?: User
        }
    }
}

export {}