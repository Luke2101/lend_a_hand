import {getValidUniqueUser, type TUser} from "../fixtures/users.js";
import AdminTools from "./AdminTools.js";
import logger from "../../src/util/logger.js";


interface BuiltUser {
    user: TUser;
    token: string[];
}

export class TestUserBuilder {
    private user: TUser;
    private balanceAmount: number = 200;
    private isProd: boolean
    constructor(isProd:boolean =false) {
        this.user = getValidUniqueUser();
        this.isProd = isProd
    }

    /**
     * Set a balance for the user after creation.
     */
    withBalance(amount: number): this {
        this.balanceAmount = amount;
        return this;
    }

    withPlz(plz: number): this {
        this.user.plz =plz;
        return this;
    }

    /**
     * Actually creates the user and applies the options.
     */
    async build(): Promise<BuiltUser> {
        // Create user in the system
        await AdminTools.createUser(this.user);

        // Get session token
        const token = await AdminTools.loginAndRetrieveSession(this.user);

        // Apply balance if specified
        await AdminTools.setBalance(this.user.email, this.balanceAmount);
        if(!this.isProd) {
            onTestFinished(async () => {
                logger.debug(`Clearing Test user=${this.user.email}`)
                await this.clean()
            })
        }

        return { user: this.user, token: token };
    }

    private async clean() {
        await AdminTools.deleteUserByMail(this.user.email);
    }
}
