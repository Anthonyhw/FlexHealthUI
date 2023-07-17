import { Claims } from "./claims.model"

export class User {
    id: string
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
    claims: Claims[]
    roles: string[]

    constructor(data?: Partial<User>) {
        if (data) {
          Object.assign(this, data);
        }
      }
}