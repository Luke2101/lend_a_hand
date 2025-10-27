import {app} from "../../src/api.js";
import request from "supertest";

import {fromNodeHeaders} from "better-auth/node";
import {afterAll} from "vitest";
import {getValidUniqueUser} from "../fixtures/users.js";
import AdminTools from "../util/AdminTools.js";
import {StatusCodes} from "http-status-codes";


let token: string[] = [];

const validtestUser = getValidUniqueUser();

beforeAll(async () => {
    await AdminTools.createUser(validtestUser);

    // A valid token is needed
    token = await AdminTools.loginAndRetrieveSession(validtestUser);
})

afterAll(async () => {
    await AdminTools.deleteUserByMail(validtestUser.email)
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

        const result = await request(app).post("/request").set("Cookie", token).send(sampleRequest)
        expect(result.status).toBe(StatusCodes.CREATED);

        requestId = result.body.id;
    })

    it("Check if request can be deleted", async () => {
        const result = await request(app).delete(`/request?id=${requestId}`).set("Cookie", token).send();
        expect(result.status).toBe(StatusCodes.OK);
    })
})
