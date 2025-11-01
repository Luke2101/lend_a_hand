// tests/setup/globalSetup.ts
import testcontainersSetup from "./testcontainers.js";

export default async function setup() {
    // Start test container
    const stopContainer = await testcontainersSetup();

    // Wait for DB to be ready before creating accounts
    //await accountsSetup();

    // Return combined teardown
    return async () => {
        await stopContainer?.();
    };
}
