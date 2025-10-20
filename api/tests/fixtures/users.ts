import {randomUUID} from "node:crypto";

export type TUser = {
    name: string,
    prename: string,
    surname: string,
    email: string,
    password: string,
    city: string,
    street: string,
    houseNumber: string,
    plz: number
}

export function getValidUniqueUser(): TUser {
    const uuid = randomUUID();
   return {
        name: "Test User",
        prename: "Test",
        surname: "User",
        email: `testuser+${uuid}@example.com`, // unique per run
        password: "StrongPassw0rd!2025", // safe, non-guessable
        city: "Testville",
        street: "Example Street",
        houseNumber: "42A",
        plz: 12345,
    };
}