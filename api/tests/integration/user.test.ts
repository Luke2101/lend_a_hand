import request from "supertest";
import {app} from "../../src/api.js";
import {afterAll, expect} from "vitest";
import {deleteUsers, prepareUsers} from "../util/dbUtil.js";
import {fromNodeHeaders} from "better-auth/node";
import {getValidUniqueUser, type TUser} from "../fixtures/users.js";

let testUserId: string[] = [];
let token: string[] = [];

const validtestUser = getValidUniqueUser();

beforeAll(async () => {
    if(process.env.DATABASE_URL == undefined) throw new Error("Cant load ENV File")
    testUserId = await prepareUsers(validtestUser);

    // A valid token is needed
    const res = await request(app).post("/auth/login").send({
        email: validtestUser.email,
        password: validtestUser.password
    })
    const headers = fromNodeHeaders(res.headers);
    token = headers.getSetCookie();
})

afterAll(async () => {
    await deleteUsers(...testUserId)
})


it("Try accessing user info with an invalid token", async () => {
    const result = await request(app).get("/user/info").set("Cookie", "testtokenthatdoesntwork11.2")
    expect(result.ok).toBeFalsy()
})

it("Try accessing user info with an valid token", async () => {
    const result = await request(app).get("/user/info").set("Cookie", token)
    expect(result.ok).toBeTruthy()
})

it("Try to change user info with valid parameters", async () => {
    const update = {
        prename: "test_prename_changed",
        surname: "test_surname_changed"
    }
    const result = await request(app).patch("/user/update").set("Cookie", token).send(update)
    expect(result.ok).toBeTruthy();

    const updatedUser = await request(app).get("/user/info").set("Cookie", token)
    expect(updatedUser.ok).toBeTruthy()

    const body = updatedUser.body as TUser;
    expect(body.prename).toBe(update.prename);
    expect(body.surname).toBe(update.surname);
    expect(body.email).toBe(validtestUser.email)
})

