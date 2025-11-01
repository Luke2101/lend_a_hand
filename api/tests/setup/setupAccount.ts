import { beforeAll } from "vitest";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import logger from "../../src/util/logger.js";
import AdminTools from "../util/AdminTools.js";
import {getValidUniqueUser} from "../fixtures/users.js";

const execAsync = promisify(exec);

export let adminToken: string[];
beforeAll(async () => {
    logger.info("Running setup script...");
    const admin = getValidUniqueUser();
    await AdminTools.createUser(admin)
    adminToken = await AdminTools.loginAndRetrieveSession(admin);
    await AdminTools.setBalance(admin.email, 999999)
});