declare global {
    interface UserModel {
        email: string;
        password: string;
        plz: number,
        street: string,
        houseNumber: string,
        city: string,
        prename: string,
        surname: string,
    }
}