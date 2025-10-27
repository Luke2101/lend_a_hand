import {randomUUID} from "node:crypto";
import { faker } from "@faker-js/faker";
export type TUser = {
    prename: string,
    surname: string,
    email: string,
    password: string,
    city: string,
    street: string,
    houseNumber: string,
    plz: number
}



export const getValidUniqueUser = () => {
    return {
        prename: faker.person.firstName(),
        surname: faker.person.lastName(),
        plz: faker.number.int({ min: 1000, max: 99999 }),
        street: faker.location.street(),
        houseNumber: faker.number.int({ min: 1, max: 100 }).toString(),
        city: faker.location.city(),
        email: faker.internet.email().toLowerCase(),
        password: faker.internet.password({ length: 10 })
    };
};
