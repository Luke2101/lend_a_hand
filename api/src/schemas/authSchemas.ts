import {z} from "zod";


export const signUpSchema = z.object({
    prename: z.string().min(1, "Vorname erforderlich"),
    surname: z.string().min(1, "Nachname erforderlich"),
    plz: z.number().min(1000).max(99999),
    street: z.string().min(1),
    houseNumber: z.string().min(1),
    city: z.string().min(1),
    email: z.email("Ungültige Email"),
    password: z.string().min(6, "Passwort muss mind. 6 Zeichen lang sein"),
});

export const signInSchema = z.object({
    email: z.email(),
    password: z.string().min(1, "Passwort erforderlich"),
});

// 🧠 automatically inferred TS types:
export type SignUpBody = z.infer<typeof signUpSchema>;
export type SignInBody = z.infer<typeof signInSchema>;
