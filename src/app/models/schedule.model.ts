import { User } from "./user.model"

export class Schedule {
    id: string
    tipo: string
    status: string
    dataConsulta: string
    dataMarcacao: string
    estabelecimentoId: number
    estabelecimento: User
    medico: User
    medicoId: number
    usario: User
    usarioId: number
    usuario: User
    especialidade: string
    valor: string
    pagamento: string
}