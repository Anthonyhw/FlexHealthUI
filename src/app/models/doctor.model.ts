
import { Stablishment } from "./stablishment.model";
import { User } from "./user.model";

export class Doctor extends User {

    crm: string;
    specialty: string;
    especialidade: string
    estabelecimento: Stablishment

    constructor(user: User, data?: Partial<Doctor>) {
        super(user);
        if (data) {
            Object.assign(this, data);
        }
    }
}