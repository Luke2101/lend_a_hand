import 'dotenv/config'
import {MySqlContainer, StartedMySqlContainer} from "@testcontainers/mysql";
import logger from "../../src/util/logger.js";
import {exec} from "node:child_process";
import {promisify} from "node:util";

const execAsync = promisify(exec);
export default async function setup(){

    const container = new MySqlContainer("mysql:8.0.31")
        .withUsername(process.env.DB_USER!)
        .withUserPassword(process.env.DB_PASS!)
        .withRootPassword(process.env.DB_ROOT_PASS!)
        .withDatabase(process.env.DB_NAME!)

    let instance: StartedMySqlContainer = await container.start()
    logger.info("Testing database successfully started!")

    process.env.DB_PORT = instance.getPort().toString()
    logger.info(`DB NAME: ${process.env.DB_NAME}`)
    logger.info(`DB PORT: ${process.env.DB_PORT}`)

    logger.info(`DB USER: ${process.env.DB_USER}`)
    logger.info(`DB PASS: ${process.env.DB_PASS}`)
    logger.info(`DB ROOT PASS: ${process.env.DB_ROOT_PASS}`)
    logger.info("⚙️ Running database setup script...");
    try {
        const { stdout, stderr } = await execAsync("npm run db:applyChanges");
        if (stdout) logger.info(stdout.trim());
        if (stderr) logger.warn(stderr.trim());
    } catch (err: any) {
        logger.error("Database setup script failed:", err);
        throw err;
    }

    return async () => {
        await instance.stop();
        logger.info("Testing database successfully shutdown")
    }


}