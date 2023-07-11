
import { User } from "./user.model";

export class Stablishment extends User {

    cnpj: string;
    tipo: string;

    constructor(user: User, data?: Partial<Stablishment>) {
        super(user);
        if (data) {
            Object.assign(this, data);
        }
    }
}