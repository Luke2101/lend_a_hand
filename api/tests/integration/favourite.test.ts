import {app} from "../../src/api.js";
import request from "supertest";
import {afterAll} from "vitest";
import {getValidUniqueUser} from "../fixtures/users.js";
import {StatusCodes} from "http-status-codes";
import AdminTools from "../util/AdminTools.js";
import TestingError from "../../src/errors/TestingError.js";

let token: string[] = [];
let testRequestId: number;

const validtestUser = getValidUniqueUser();

beforeAll(async () => {
    // prepare user
    const testUserCreated = await AdminTools.createUser(validtestUser);
    if(!testUserCreated) throw new TestingError("Test user could not be created!")
    // login user to get valid token
    token = await AdminTools.loginAndRetrieveSession(validtestUser);
    // Create a test request for favourites
    const sampleRequest = {
        title: "Test Request for Favourites",
        category: "Test Category",
        credits: 10,
        description: "Testing favourite functionality",
        from: "2025-10-25T09:00:00Z",
        to: "2025-10-30T17:00:00Z",
    };

    const requestRes = await request(app).post("/request").set("Cookie", token).send(sampleRequest);
    testRequestId = requestRes.body.id;
});

afterAll(async () => {
    // cleanup users
    await AdminTools.deleteUserByMail(validtestUser.email)
});

describe("Testing FavouriteService", () => {
    it("Get empty favourites for new user", async () => {
        const res = await request(app).get("/favourites").set("Cookie", token);
        expect(res.ok).toBeTruthy();
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });

    it("Add a favourite request successfully", async () => {
        const res = await request(app)
            .post(`/favourites?id=${testRequestId}`)
            .set("Cookie", token)
            .send();
        expect(res.status).toBe(201);
    });

    it("Adding the same request again should fail with conflict", async () => {
        const res = await request(app)
            .post(`/favourites?id=${testRequestId}`)
            .set("Cookie", token)
            .send();
        expect(res.status).toBe(409);
    });

    it("Get favourites should now include added request", async () => {
        const res = await request(app).get("/favourites").set("Cookie", token);
        expect(res.ok).toBeTruthy();
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body).toContain(testRequestId);
    });

    it("Remove favourite successfully", async () => {
        const res = await request(app)
            .delete(`/favourites?id=${testRequestId}`)
            .set("Cookie", token)
            .send();
        expect(res.ok).toBeTruthy();
    });

    it("Remove a non-existent favourite should fail", async () => {
        const res = await request(app)
            .delete(`/favourites?id=${testRequestId}`)
            .set("Cookie", token)
            .send();
        expect(res.status).toBe(StatusCodes.CONFLICT);
    });

    it("Add favourite with invalid id should fail", async () => {
        const res = await request(app).post("/favourites?id=-1").set("Cookie", token).send();
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("Remove favourite with invalid id should fail", async () => {
        const res = await request(app).delete("/favourites?id=-1").set("Cookie", token).send();
        expect(res.status).toBe(StatusCodes.BAD_REQUEST);
    });
});
