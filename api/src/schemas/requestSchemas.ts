import {z} from "zod";

export const createRequestSchema = z.object({
    title: z.string().min(1).max(255),
    category: z.string().min(1).max(255),
    credits: z.number().int().positive(),
    description: z.string().min(1),
    from: z.iso.datetime(),
    to: z.iso.datetime()
});

// Type inference for TypeScript
export type CreateRequestBody = z.infer<typeof createRequestSchema>;