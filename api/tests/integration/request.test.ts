import {app} from "../../src/api.js";
import {deleteUsers, prepareUsers} from "../util/dbUtil.js";
import request from "supertest";

import {fromNodeHeaders} from "better-auth/node";
import {afterAll} from "vitest";
import {getValidUniqueUser} from "../fixtures/users.js";


let testUserId: string[] = [];
let token: string[] = [];

const validtestUser = getValidUniqueUser();

beforeAll(async () => {
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
describe("Tesing Request Cycle", () => {
    let requestId: number | undefined;
    it("Create a new request within limit", async () => {
        const sampleRequest = {
            "title": "Website Design Request",
            "category": "Graphic Design",
            "credits": 50,
            "description": "Need a modern, responsive website design for a small business.",
            "from": "2025-10-22T09:00:00Z",
            "to": "2025-10-29T17:00:00Z"

        }

        const result = await request(app).post("/request/create").set("Cookie", token).send(sampleRequest)
        expect(result.ok).toBeTruthy();

        requestId = result.body.id;
    })

    it("Check if request can be deleted", async () => {
        const result = await request(app).delete("/request/remove").set("Cookie", token).send({
            id: requestId
        })
        expect(result.ok).toBeTruthy();
    })
})
