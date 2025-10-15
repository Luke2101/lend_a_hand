import type {Express} from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from "swagger-jsdoc";
import logger from "./util/logger.js";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My Express API",
            version: "1.0.0",
            description: "Automatically generated API documentation",
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ["./dist/src/routes/*.js"], // Adjust path if your route files are in JS
};
const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    logger.info("Presented documentation under /api-docs")
};
