export class UpdateUser {
  user: string
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
  token: string

  constructor(data?: Partial<UpdateUser>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}