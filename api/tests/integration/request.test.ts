import {app} from "../../src/api.js";
import request from "supertest";
import {StatusCodes} from "http-status-codes";
import RequestCategory from "../../src/util/RequestCategory.js";
import TestRequestBuilder from "../util/TestRequestBuilder.js";
import {TestUserBuilder} from "../util/TestUserBuilder.js";
import AdminTools from "../util/AdminTools.js";
import {faker} from "@faker-js/faker";

describe("Create Request", async () => {


    it("User creates new invalid request", async () => {
        const userA = await new TestUserBuilder().build();
        const result = await request(app).post("/request").set("Cookie" , userA.token).send({
            title: "My title",
            description: "This is a description"
        });

        expect(result.status).toBe(StatusCodes.BAD_REQUEST)
    })

    it("User A creates new valid request", async () => {
        const userA = await new TestUserBuilder().build();
        const result = await request(app).post("/request").set("Cookie" , userA.token).send({
            title: "My title",
            description: "This is a description",
            category: RequestCategory.RENT,
            credits: 50
        });

        expect(result.status).toBe(StatusCodes.CREATED)
    })

    it("Create Request with insufficient balance", async () => {
        const userA = await new TestUserBuilder().withBalance(50).build();
        const result = await request(app).post("/request").set("Cookie" , userA.token).send({
            title: "My title",
            description: "This is a description",
            category: RequestCategory.RENT,
            credits: 75
        });
        expect(result.status).toBe(StatusCodes.PAYMENT_REQUIRED)
    })
})

describe("Get Request", async () => {



    it("Get Request with invalid id", async () => {
        const user = await new TestUserBuilder().withBalance(100).build();
        const result = await request(app).get(`/request?id=${90}`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.NOT_FOUND)
    })

    it("Get Request with valid id", async () => {
        const user = await new TestUserBuilder().withBalance(100).build();
        const {id} = await new TestRequestBuilder().create(user.token);
        const result = await request(app).get(`/request?id=${id}`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.OK)
        expect(result.body).toHaveProperty("id")
        expect(result.body).toHaveProperty("creator")
        expect(result.body).toHaveProperty("credits")
    })

    it("Get own requests that dont exist" , async () => {
        const user = await new TestUserBuilder().build();
        const result = await request(app).get(`/request/self`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.OK);
        expect(result.body).toStrictEqual([])
    })

    it("Get own requests" , async () => {
        const user = await new TestUserBuilder().build();

        for(let i = 0; i < 3; i++) {
            await new TestRequestBuilder().withCredits(50).create(user.token)
        }
        const result = await request(app).get(`/request/self`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.OK);
        const body: [] = result.body;
        expect(body.length).toBe(3)
    })
})

describe("Delete Request", async () => {




    it("Delete Request with invalid id", async () => {
        const user = await new TestUserBuilder().build();
        const result = await request(app).delete(`/request?id=${789}`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.FORBIDDEN)
    })

    it("Delete Request with valid id that does not belong to user", async () => {
        const user = await new TestUserBuilder().build();
        const user2 = await new TestUserBuilder().build();
        const {id} = await new TestRequestBuilder().create(user2.token)
        const result = await request(app).delete(`/request?id=${id}`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.FORBIDDEN)
    })

    it("Delete Request with valid id that does belong to user", async () => {
        const user2 = await new TestUserBuilder().build();
        const {id} = await new TestRequestBuilder().create(user2.token)
        const result = await request(app).delete(`/request?id=${id}`).set("Cookie", user2.token);
        expect(result.status).toBe(StatusCodes.OK)
    })
})

describe("Update Request", async () => {




    it("Updating a request that does not exist", async () => {
        const testuser = await new TestUserBuilder().build();
        const result = await request(app).patch(`/request?id=${738}`).set("Cookie", testuser.token).send({
            description: "This is the new description"
        })
        expect(result.status).toBe(StatusCodes.FORBIDDEN)
    })



    it("Updating a valid request", async () => {
        const testuser = await new TestUserBuilder().build();
        const testRequest = await new TestRequestBuilder().create(testuser.token);
        const result = await request(app).patch(`/request?id=${testRequest.id}`).set("Cookie", testuser.token).send({
            description: "This is the new description",
            title: "Updated title"
        })
        expect(result.status).toBe(StatusCodes.OK);
    })

    it("Updating a request that a user doesn't own", async () => {
        const user = await new TestUserBuilder().build();
        const testuser = await new TestUserBuilder().build();
        const testRequest = await new TestRequestBuilder().create(testuser.token);
        const result = await request(app).patch(`/request?id=${testRequest.id}`).set("Cookie", user.token).send({
            description: "This is the new description",
            title: "Updated title"
        })

        expect(result.status).toBe(StatusCodes.FORBIDDEN)
    })

})

describe("Accept Request" , async () => {
    it("Accepting a non-existant request", async () => {
        const user = await new TestUserBuilder().build();
        const result = await request(app).patch(`/request/accept?id=${777}`).set("Cookie", user.token).send();
        expect(result.status).toBe(StatusCodes.NOT_FOUND);
    })

    it("Accepting own request", async () => {
        const user = await new TestUserBuilder().build();
        const testRequest = await new TestRequestBuilder().create(user.token);
        const result = await request(app).patch(`/request/accept?id=${testRequest.id}`).set("Cookie", user.token).send();
        expect(result.status).toBe(StatusCodes.FORBIDDEN)
    })

    it("Accepting an valid existant request", async () => {
        const user = await new TestUserBuilder().build();
        const creator = await new TestUserBuilder().build();
        const testRequest = await new TestRequestBuilder().create(creator.token);
        const result = await request(app).patch(`/request/accept?id=${testRequest.id}`).set("Cookie", user.token).send();
        expect(result.status).toBe(StatusCodes.OK)
    })
})

describe("Finish Request", async () => {
    it("Finish a request that does not exist", async () => {
        const user = await new TestUserBuilder().build();
        const result = await request(app).post(`/request/finish?id=${777}`).set("Cookie", user.token).send();
        console.log(result)
        expect(result.status).toBe(StatusCodes.FORBIDDEN)

    })
    it("Finish a request that user does not own", async () => {
        const creator = await new TestUserBuilder().build();
        const user = await new TestUserBuilder().build();
        const testRequest = await new TestRequestBuilder().create(creator.token);
        const result = await request(app).post(`/request/finish?id=${testRequest.id}`).set("Cookie", user.token).send();
        expect(result.status).toBe(StatusCodes.FORBIDDEN)
    })
    it("Finish a request that has not been accepted yet", async () => {
        const creator = await new TestUserBuilder().build();
        const testRequest = await new TestRequestBuilder().create(creator.token);
        const result = await request(app).post(`/request/finish?id=${testRequest.id}`).set("Cookie", creator.token).send();
        expect(result.status).toBe(StatusCodes.CONFLICT)
    })
    it("Finish a request with insufficient balance", async () => {
        const user = await new TestUserBuilder().build();
        const acceptUser = await new TestUserBuilder().build();
        const testRequest = await new TestRequestBuilder().withCredits(50).create(user.token);
        await AdminTools.setBalance(user.user.email, 0);
        await AdminTools.acceptRequest(testRequest.id, acceptUser.token)

        const result = await request(app).post(`/request/finish?id=${testRequest.id}`).set("Cookie", user.token).send();
        expect(result.status).toBe(StatusCodes.PAYMENT_REQUIRED)
    })
    it("Finish a request successfully", async () => {
        const creator = await new TestUserBuilder().build();
        const acceptUser = await new TestUserBuilder().build();
        const testRequest = await new TestRequestBuilder().withCredits(50).create(creator.token);
        await AdminTools.acceptRequest(testRequest.id, acceptUser.token);
        const result = await request(app).post(`/request/finish?id=${testRequest.id}`).set("Cookie", creator.token).send();
        expect(result.status).toBe(StatusCodes.OK);
        const body = result.body;
        expect(body).toHaveProperty("amount");
        expect(body.amount).toBe(testRequest.credits)

    })
})

describe("Nearby Requests", async () => {

    it("Check for requests nearby that dont exist", async () => {
        const user = await new TestUserBuilder().build();
        const result = await request(app).get(`/request/nearby`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.OK);
        expect(result.body).toStrictEqual([]);

    })
    it("Check for requests nearby that do exist", async () => {
        // Generating some requests
        for(let i = 0; i < 5; i++) {
            const tempUser = await new TestUserBuilder().withBalance(200).withPlz(faker.number.int({min: 74800, max: 74899})).build()
            await new TestRequestBuilder().create(tempUser.token);
        }
        const user = await new TestUserBuilder().withPlz(74858).build();
        const result = await request(app).get(`/request/nearby`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.OK);
        expect(result.body.length).toBe(5);
    })
    it("Check for requests that arent nearby but do exist", async () => {
        for(let i = 0; i < 5; i++) {
            const tempUser = await new TestUserBuilder().withBalance(200).withPlz(faker.number.int({min: 14800, max: 84899})).build()
            await new TestRequestBuilder().create(tempUser.token);
        }
        const user = await new TestUserBuilder().withPlz(94500).build();
        const result = await request(app).get(`/request/nearby`).set("Cookie", user.token);
        expect(result.status).toBe(StatusCodes.OK);
        expect(result.body.length).toBe(0)

    })

})
