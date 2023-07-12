import { Day } from "./day.model"

export class AgendamentoDto {
    Tipo: string
    Status: string
    MedicoId: number
    EstabelecimentoId: number
    Especialidade: string
    Datas: Day[]

    constructor(data?: Partial<AgendamentoDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}