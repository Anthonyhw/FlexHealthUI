export class ArchiveDto {
    arquivo: File
    id: number
    url: string
    usuarioId: number
    medicoId: number
    agendamentoId: number
    proposito: string
    tipoExame: string
    visibilidade: boolean;


    constructor(data?: Partial<ArchiveDto>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}