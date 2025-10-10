import {auth, db} from "../../lib/auth.js";
import {user} from "../auth-schema.js";
import {eq} from "drizzle-orm";

class UserOperations {
    public async createUser(prename: string, surname: string, plz: number, street:string, houseNumber: string, city:string, email: string, password: string ) {
        const result = await auth.api.signUpEmail({
            body: {
                name: `${prename} ${surname}`,
                email: email,
                password: password,
                prename: prename,
                surname: surname,
                plz: plz,
                street: street,
                houseNumber: houseNumber,
                city: city,
            }
        })
        console.log("Hat geklappt")
    }


    public async checkIfEmailExists(email: string): Promise<boolean> {
        const result = await db.select({email: user.email}).from(user).where(eq(user.email, email));
        return result.length > 0;
    }
}

export default new UserOperations();