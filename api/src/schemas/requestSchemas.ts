import {z} from "zod";
import RequestCategory from "../util/RequestCategory.js";

export const createRequestSchema = z.object({
    title: z.string().min(1).max(255),
    category: z.enum(RequestCategory),
    credits: z.number().int().nonnegative(),
    description: z.string().min(1).optional(),
    from: z.iso.datetime().optional().nullable(),
    to: z.iso.datetime().optional().nullable()
});

export const updateRequestQuerySchema = z.object({
    id: z.coerce.number().int().positive(),
})

export const idParamStringQuerySchema = z.object({
    id: z.string().nonempty()
})

export const idArrayQuerySchema = z.array(z.number())

export const updateReuqestSchema = createRequestSchema.partial();

// Type inference for TypeScript
export type CreateRequestBody = z.infer<typeof createRequestSchema>;
export type UpdateRequestBody = z.infer<typeof updateReuqestSchema >;
export type IdParam = z.infer<typeof updateRequestQuerySchema>;
export type IdParamString = z.infer<typeof idParamStringQuerySchema>;
export type IdArrayBody = z.infer<typeof idArrayQuerySchema>;