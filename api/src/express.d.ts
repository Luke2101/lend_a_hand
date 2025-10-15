
declare global {
    namespace Express {
        export interface Request {
            session?: Session;
        }
    }
}

export {}