import request from "supertest";
import {app} from "../../src/api.js";
import {afterAll, expect} from "vitest";
import {getValidUniqueUser} from "../fixtures/users.js";
import AdminTools from "../util/AdminTools.js";
import {StatusCodes} from "http-status-codes";


const validSignupUser = getValidUniqueUser();
const existingSignupUser = getValidUniqueUser();

beforeAll(async () => {
    await AdminTools.createUser(existingSignupUser);
})

describe("Registration", () => {
    it("Register User with invalid parameters", async () => {
        const result = await request(app).post("/auth/signup").send({});
        expect(result.status).toBe(StatusCodes.BAD_REQUEST);
    })

    it("Register valid User with valid parameters", async () => {
        const result = await request(app).post("/auth/signup").send(validSignupUser);
        expect(result.status).toBe(StatusCodes.CREATED);
    })

    it("Register user with already registered email", async () => {
        const result = await request(app).post("/auth/signup").send(existingSignupUser);
        expect(result.status).toBe(StatusCodes.CONFLICT);
    })
})

describe("Login", () => {
    it("Login with missing Credentials", async () => {
        const result = await request(app).post("/auth/login").send({});
        expect(result.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("Login with invalid Credentials", async () => {
        const result = await request(app).post("/auth/login").send({
            email: "integrationTest@mail.com",
            password: "root"
        });
        expect(result.status).toBe(StatusCodes.UNAUTHORIZED);
    })

    it("Login with correct Credentials", async () => {
        const result = await request(app).post("/auth/login").send({
            email: validSignupUser.email,
            password: validSignupUser.password
        });
        expect(result.status).toBe(StatusCodes.OK);
        expect(result.body).toHaveProperty("message");
    })
})

afterAll(async () => {
    await AdminTools.deleteUserByMail(validSignupUser.email)
    await AdminTools.deleteUserByMail(existingSignupUser.email);
})


