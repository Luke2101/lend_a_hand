import { auth, db } from "../lib/auth.js";
import { user } from "../db/auth-schema.js";
import { eq } from "drizzle-orm";
import type { SignUpBody } from "../schemas/authSchemas.js";
import DatabaseError from "../errors/DatabaseError.js";
import chalk, { colorNames, colors } from "chalk";
import logger from "../util/logger.js";
import { StatusCodes } from "http-status-codes";
import type { UpdateUserBody } from "../schemas/userSchemas.js";

/**
 * @class UserRepository
 * @classdesc Data access layer for user-related database operations
 *
 * @description
 * Handles all direct database interactions for user management including
 * user creation, updates, and email verification. Integrates with Better Auth
 * for authentication while managing additional user profile data.
 */
class UserRepository {
    /**
     * Creates a new user in the system
     * @param {SignUpBody} body - User registration data
     * @returns {Promise<boolean>} True if user creation successful, false otherwise
     *
     * @remarks
     * Uses Better Auth for user creation while storing additional profile information
     * like prename, surname, address, and location data.
     *
     * @example
     * await createUser({
     *   prename: "John",
     *   surname: "Doe",
     *   email: "john@example.com",
     *   password: "securepassword",
     *   plz: 12345,
     *   street: "Main Street",
     *   houseNumber: "10",
     *   city: "Berlin"
     * });
     */
    public async createUser(body: SignUpBody) {
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

    /**
     * Updates user profile information in the database
     * @param {UpdateUserBody} updateBody - Data to update for the user
     * @param {string} userId - ID of the user to update
     * @returns {Promise<boolean>} True if update successful, false otherwise
     *
     * @example
     * await updateUser({ prename: "Jane", city: "Munich" }, "user-123");
     */
    public async updateUser(updateBody: UpdateUserBody, userId: string) {
        try {
            await db.update(user).set(updateBody).where(eq(user.id, userId))
            return true;
        } catch (err: any) {
            logger.error(err);
            return false;
        }
    }

    /**
     * Checks if an email address already exists in the system
     * @param {string} email - Email address to check
     * @returns {Promise<boolean>} True if email exists, false if available or on error
     *
     * @throws {DatabaseError} When database is not reachable (currently catches and returns false)
     *
     * @example
     * const exists = await checkIfEmailExists("test@example.com");
     * if (exists) {
     *   // Handle duplicate email
     * }
     */
    public async checkIfEmailExists(email: string): Promise<boolean> {
        try {
            const result = await db.select({email: user.email}).from(user).where(eq(user.email, email));
            return result.length > 0;
        }catch(err: any) {
            console.error(err)
            return false;
        }
    }
}

export default UserRepository;