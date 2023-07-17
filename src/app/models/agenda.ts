import { Day } from "./day.model"
import { User } from "./user.model"

export class Agenda {
    tipo: string
    status: string
    medicoId: number
    medico: User
    estabelecimentoId: number
    estabelecimento: User
    especialidade: string
    datas: Day[]

    constructor(data?: Partial<Agenda>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}