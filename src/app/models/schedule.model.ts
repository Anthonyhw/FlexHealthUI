import { User } from "./user.model"

export class Schedule {
    id: string
    tipo: string
    status: string
    dataConsulta: string
    dataMarcacao: string
    estabelecimentoId: number
    medicoId: number
    usarioId: number
    usuario: User
    especialidade: string
    valor: string
}