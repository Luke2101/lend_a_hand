import type {CreateRequestBody} from "../../src/schemas/requestSchemas.js";
import {faker} from "@faker-js/faker";
import RequestCategory from "../../src/util/RequestCategory.js";
import AdminTools from "./AdminTools.js";
import TestingError from "../../src/errors/TestingError.js";
import logger from "../../src/util/logger.js";

class TestRequestBuilder {
    private request: CreateRequestBody

    constructor() {
        this.request = {
            title: faker.food.ingredient(),
            from: faker.date.recent().toISOString(),
            to: faker.date.soon().toISOString(),
            credits: 50,
            category: RequestCategory.HELP,
            description: faker.lorem.text()
        }
    }

    public withCredits(credits: number): this {
        this.request.credits = credits;
        return this;
    }

    public withCategory(category: RequestCategory): this {
        this.request.category = category;
        return this;
    }

    public async create(creatorToken: string[]) {
        const resBody = await AdminTools.createSampleRequest(this.request, creatorToken)
        if(!Object.hasOwn(resBody, "id")) throw new TestingError("Unable to get sample request id")
        onTestFinished(async () => {
            logger.debug(`Clearing Test Request with id=${resBody.id}`);
            await AdminTools.deleteRequestById(resBody.id)
        })
        return {
            id: resBody.id as number,
            credits: this.request.credits
        }
    }


}

export default TestRequestBuilder;