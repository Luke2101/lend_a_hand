import type { Request, Response, NextFunction } from "express";
import {StatusCodes} from "http-status-codes";
import {z} from "zod";
export function validateBody(schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error.issues.map(i => ({
                field: i.path.join("."),
                message: i.message,
            }));
            return res.status(StatusCodes.BAD_REQUEST).json({ errors });
        }

        req.body = result.data;
        next();
    };
}

export function validateQuery(schema: z.ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            const errors = result.error.issues.map(i => ({
                field: i.path.join("."),
                message: i.message,
            }));
            return res.status(StatusCodes.BAD_REQUEST).json({ errors });
        }
        next();
    };
}
