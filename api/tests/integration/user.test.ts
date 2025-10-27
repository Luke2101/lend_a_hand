import request from "supertest";
import {app} from "../../src/api.js";
import {afterAll, expect} from "vitest";
import {getValidUniqueUser, type TUser} from "../fixtures/users.js";
import AdminTools from "../util/AdminTools.js";
import {StatusCodes} from "http-status-codes";

let token: string[] = [];

const validtestUser = getValidUniqueUser();


beforeAll(async () => {
    await AdminTools.createUser(validtestUser);
    token = await AdminTools.loginAndRetrieveSession(validtestUser);
})

describe("Profile Tests", () => {
    it("Try accessing user info with an invalid token", async () => {
        const result = await request(app).get("/user/info").set("Cookie", "testtokenthatdoesntwork11.2")
        expect(result.status).toBe(StatusCodes.UNAUTHORIZED)
    })

    it("Try accessing user info with an valid token", async () => {
        const result = await request(app).get("/user/info").set("Cookie", token)
        expect(result.status).toBe(StatusCodes.OK)
    })

    it("Try to change user info with valid parameters", async () => {
        const update = {
            prename: "test_prename_changed",
            surname: "test_surname_changed"
        }
        const result = await request(app).patch("/user").set("Cookie", token).send(update)
        expect(result.status).toBe(StatusCodes.OK);

        const updatedUser = await request(app).get("/user/info").set("Cookie", token)
        expect(updatedUser.ok).toBeTruthy()

        const body = updatedUser.body as TUser;
        expect(body.prename).toBe(update.prename);
        expect(body.surname).toBe(update.surname);
        expect(body.email).toBe(validtestUser.email)
    })
})
describe("Logout Tests", () => {
    it("Logout validtestUser with an existing session", async () => {
        const result = await request(app).post("/user/logout").set("Cookie",token).send();
        expect(result.status).toBe(StatusCodes.NO_CONTENT);
    })

    it("Logout with no existing session", async () => {
        const result = await request(app).post("/user/logout").send();
        expect(result.status).toBe(StatusCodes.UNAUTHORIZED);
    })

    it("Logout with an invalid existing session", async () => {
        const result = await request(app).post("/user/logout").set("Cookie",token).send();
        expect(result.status).toBe(StatusCodes.UNAUTHORIZED);
    })
})


afterAll(async () => {
    await AdminTools.deleteUserByMail(validtestUser.email)
})