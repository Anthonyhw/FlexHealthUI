import { Day } from "./day.model"

export class AgendamentoDto {
    Tipo: string
    Status: string
    MedicoId: number
    Especialidade: string
    Datas: Day[]

    constructor(data?: Partial<AgendamentoDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}