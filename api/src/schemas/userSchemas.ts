import {z} from "zod";


export const updateSchema = z.object({
    prename: z.string().min(1, "Vorname erforderlich"),
    surname: z.string().min(1, "Nachname erforderlich"),
    plz: z.number().min(1000).max(99999),
    street: z.string().min(1),
    houseNumber: z.string().min(1),
    city: z.string().min(1),
}).partial();

export type UpdateBody = z.infer<typeof updateSchema>;
