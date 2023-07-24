import { ArchiveDto } from "./archiveDto.model"
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
    usuario: User
    usuarioId: number
    especialidade: string
    valor: string
    pagamento: string
    prescricoes: ArchiveDto[]
}