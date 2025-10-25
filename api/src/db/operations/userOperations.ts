import {auth, db} from "../../lib/auth.js";
import {user} from "../auth-schema.js";
import {eq} from "drizzle-orm";
import type {SignUpBody} from "../../schemas/authSchemas.js";
import DatabaseError from "../../errors/DatabaseError.js";
import chalk, {colorNames, colors} from "chalk";
import logger from "../../util/logger.js";
import {StatusCodes} from "http-status-codes";
import type {UpdateUserBody} from "../../schemas/userSchemas.js";

class UserOperations {


    public static async createUser(body: SignUpBody) {
        const {prename, surname, plz, street, houseNumber, city, email, password} = body;
        try {
            const result = await auth.api.signUpEmail({
                body: {
                    name: `${prename} ${surname}`,
                    email: email,
                    password: password,
                    prename: prename,
                    surname: surname,
                    plz: plz,
                    street: street,
                    houseNumber: houseNumber,
                    city: city,
                }
            })
            logger.info(`Successfully created user with id=[${chalk.yellow(result.user.id)}] and email=[${chalk.yellow(email)}]`);
            return true;
        }catch (err) {
            logger.error(`Unable to create user with email=[${chalk.yellow(email)}]`)
            logger.error(err)
            return false;
        }

    }

    public static async updateUser(updateBody: UpdateUserBody, userId: string) {
        try {
            await db.update(user).set(updateBody).where(eq(user.id, userId))
            return true;
        } catch (err: any) {
            logger.error(err);
            return false;

        }
    }


    /**
     * @throws DatabaseError if the database is not reachable
     * @param email Email that should be checked if it already exists an account for
     */
    public static async checkIfEmailExists(email: string): Promise<boolean> {
        try {
            const result = await db.select({email: user.email}).from(user).where(eq(user.email, email));
            return result.length > 0;
        }catch(err: any) {
            console.error(err)
            return false;
        }
    }
}

export default UserOperations;