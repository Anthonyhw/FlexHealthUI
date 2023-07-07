export class User {
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

    constructor(data?: Partial<User>) {
        if (data) {
          Object.assign(this, data);
        }
      }
}