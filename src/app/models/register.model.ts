export class Register {
    userName: string
    nome: string
    genero: string
    nascimento: Date
    rg: string
    cpf: string
    phoneNumber: string
    endereco: string
    email: string
    password: string
    fotoPerfil: string
    cnpj: string
    crm: string
    tipo: string
    especialidade: string
    estabelecimentoId: string

    constructor(data?: Partial<Register>) {
        if (data) {
          Object.assign(this, data);
        }
      }
}