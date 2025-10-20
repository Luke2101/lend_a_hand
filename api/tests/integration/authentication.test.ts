import request from "supertest";
import {app} from "../../src/api.js";
import {afterAll, expect} from "vitest";
import logger from "../../src/util/logger.js";
import {deleteUserByMail} from "../util/dbUtil.js";
import {getValidUniqueUser} from "../fixtures/users.js";
const validtestUser = getValidUniqueUser();
describe("Registration", () => {
    it("Try to Register User with invalid parameters", async () => {
        const result = await request(app).post("/auth/signup").send({});
        expect(result.ok).toBeFalsy();
    })

    it("Try to Register User with valid parameters", async () => {
        const result = await request(app).post("/auth/signup").send(validtestUser);
        expect(result.ok).toBeTruthy();
    })
})

describe("Login", () => {
    it("Login with missing Credentials", async () => {
        const result = await request(app).post("/auth/login").send({});
        expect(result.ok).toBeFalsy();
    })

    it("Login with invalid Credentials", async () => {
        const result = await request(app).post("/auth/login").send({
            email: "integrationTest@mail.com",
            password: "root"
        });
        expect(result.ok).toBeFalsy();
    })

    it("Login with correct Credentials", async () => {
        const result = await request(app).post("/auth/login").send({
            email: validtestUser.email,
            password: validtestUser.password
        });
        expect(result.ok).toBeTruthy();
    })
})

afterAll(async () => {


    console.log("Clearing data")
    await deleteUserByMail(validtestUser.email)
    logger.info("Cleared up test data")
})


