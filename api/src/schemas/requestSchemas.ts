import {z} from "zod";

export const createRequestSchema = z.object({
    title: z.string().min(1).max(255),
    category: z.string().min(1).max(255),
    credits: z.number().int().positive(),
    description: z.string().min(1).optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional()
});



export const deleteRequestSchema = z.object({
    id: z.int()
})

// Type inference for TypeScript
export type CreateRequestBody = z.infer<typeof createRequestSchema>;
export type DeleteRequestBody = z.infer<typeof deleteRequestSchema>;