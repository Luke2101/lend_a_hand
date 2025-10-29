import {app} from "../../src/api.js";
import request from "supertest";
import {getValidUniqueUser} from "../fixtures/users.js";
import AdminTools from "../util/AdminTools.js";
import {StatusCodes} from "http-status-codes";
import RequestCategory from "../../src/util/RequestCategory.js";
import type {InsertRequest} from "../../src/types.js";
import type {CreateRequestBody} from "../../src/schemas/requestSchemas.js";


describe("Create Request", async () => {
    const userA = getValidUniqueUser();
    let aToken: string[];
    await AdminTools.createUser(userA);
    aToken = await AdminTools.loginAndRetrieveSession(userA);
    await AdminTools.setBalance(userA.email, 100)

    it("User A creates new invalid request", async () => {
        const result = await request(app).post("/request").set("Cookie" , aToken).send({
            title: "My title",
            description: "This is a description"
        });

        expect(result.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("User A creates new valid request", async () => {
        const result = await request(app).post("/request").set("Cookie" , aToken).send({
            title: "My title",
            description: "This is a description",
            category: RequestCategory.RENT,
            credits: 50
        });

        expect(result.status).toBe(StatusCodes.CREATED)
    })
})

describe("Get Request", async () => {

    const userA = getValidUniqueUser();
    let aToken: string[];
    await AdminTools.createUser(userA);
    aToken = await AdminTools.loginAndRetrieveSession(userA);
    await AdminTools.setBalance(userA.email, 100)


    const req: CreateRequestBody = {
        title: "Sample",
        credits: 100,
        category: RequestCategory.RENT,
    }
    const {id} = await AdminTools.createSampleRequest(req, aToken)

    it("Get Request with invalid id", async () => {
        const result = await request(app).get(`/request?id=${90}`).set("Cookie", aToken);
        expect(result.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("Get Request with valid id", async () => {
        const result = await request(app).get(`/request?id=${id}`).set("Cookie", aToken);
        expect(result.status).toBe(StatusCodes.OK)
        expect(result.body).toHaveProperty("id")
        expect(result.body).toHaveProperty("creator")
        expect(result.body).toHaveProperty("credits")
    })
})

describe("Delete Request", async () => {

    const userA = getValidUniqueUser();
    let aToken: string[];
    await AdminTools.createUser(userA);
    aToken = await AdminTools.loginAndRetrieveSession(userA);
    await AdminTools.setBalance(userA.email, 100)

    const req: CreateRequestBody = {
        title: "Sample",
        credits: 100,
        category: RequestCategory.RENT,
    }
    const {id} = await AdminTools.createSampleRequest(req, aToken);

    it("Delete Request with invalid id", async () => {
        const result = await request(app).delete(`/request?id=${789}`).set("Cookie", aToken);
        expect(result.status).toBe(StatusCodes.FORBIDDEN)
    })

    it("Delete Request with valid id", async () => {
        const result = await request(app).delete(`/request?id=${id}`).set("Cookie", aToken);
        expect(result.status).toBe(StatusCodes.OK)
    })
})


