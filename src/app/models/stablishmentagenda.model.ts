import { Schedule } from "./schedule.model";
import { User } from "./user.model"

export class StablishmentAgenda {
    estabelecimento: User
    agenda: Schedule[]

    constructor(data?: Partial<StablishmentAgenda>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}