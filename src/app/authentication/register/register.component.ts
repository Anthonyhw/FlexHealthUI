import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValidatorField } from '../../../helpers/validatorField'
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { env } from 'src/environments/environment';
import { Register } from 'src/models/register.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  data: Date;
  readonly = true;
  form: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  checkname: boolean;

  get f(): any {
    return this.form.controls;
  }

  public cep: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit() {
    this.validation();
  }

  formatRg(input: any) {
    let valor = input.target.value;
    valor = valor.replace(/\D/g, '');

    const x = valor.substr(0, 2);
    const y = valor.substr(2, 3);
    const z = valor.substr(5, 3);
    const a = valor.substr(8, 1);

    let formatedRg = '';
    if (x) {
      formatedRg += x;
      if (y) {
        formatedRg += '.' + y;
        if (z) {
          formatedRg += '.' + z;
          if (a) {
            formatedRg += '-' + a;
          }
        }
      }
    }

    input.target.value = formatedRg;
    this.f.rg.value = formatedRg;
    debugger
    console.log(this.f.rg.errors);
  }

  formatCpf(input: any) {
    let valor = input.target.value;
    valor = valor.replace(/\D/g, '');

    const x = valor.substr(0, 3);
    const y = valor.substr(3, 3);
    const z = valor.substr(6, 3);
    const a = valor.substr(9, 2);

    let formatedCpf = '';
    if (x) {
      formatedCpf += x;
      if (y) {
        formatedCpf += '.' + y;
        if (z) {
          formatedCpf += '.' + z;
          if (a) {
            formatedCpf += '-' + a;
          }
        }
      }
    }

    input.target.value = formatedCpf;
    this.f.cpf.value = formatedCpf;
  }

  formatPhone(input: any) {
    let valor = input.target.value;
    valor = valor.replace(/\D/g, '');

    const x = valor.substr(0, 2);
    const y = valor.substr(2, 5);
    const z = valor.substr(7, 4);

    let formatedPhone = '';
    if (x) {
      formatedPhone += '(' + x;
      if (y) {
        formatedPhone += ') ' + y;
        if (z) {
          formatedPhone += '-' + z;
        }
      }
    }

    input.target.value = formatedPhone;
    this.f.telefone.value = formatedPhone;
  }

  searchAddress(cep: string) {
    this.http.get(`https://viacep.com.br/ws/${cep}/json`).subscribe({
      next: (result: any) => {
        this.form.get('endereco').setValue(result.logradouro + ' - ' + result.bairro);
        this.form.get('cidade').setValue(result.localidade);
        this.form.get('estado').setValue(result.uf);
      }
    })
  }

  validation() {
    const formOptions: AbstractControlOptions = {
      validators: [ValidatorField.mustMatch('senha', 'confirmasenha'), ValidatorField.checkName('nome')]
    };

    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rg: ['', [Validators.required, Validators.minLength(11)]],
      cpf: ['', [Validators.required, Validators.minLength(14)]],
      nascimento: [new Date(), Validators.required],
      genero: ['', Validators.required],
      telefone: ['', [Validators.required, Validators.minLength(15)]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmasenha: ['', Validators.required],
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      complemento: [''],
      termos: [false, Validators.requiredTrue]
    }, formOptions);
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toastr.error('Verifique os campos preenchidos.', 'Erro');
      return;
    }

    const register = new Register({
      userName: this.f.email.value,
      nome: this.f.nome.value,
      genero: this.f.genero.value,
      nascimento: this.f.nascimento.value,
      rg: this.f.rg.value,
      cpf: this.f.cpf.value,
      phoneNumber: this.f.telefone.value,
      endereco: this.f.cep.value + '\\' + this.f.endereco.value + '\\' + this.f.numero.value + '\\' + this.f.cidade.value + '\\' + this.f.estado.value + '\\' + this.f.complemento.value,
      email: this.f.email.value,
      password: this.f.senha.value,
    });

    this.http.post(env.api + 'account/register', JSON.stringify(register), { headers: { 'Content-Type': 'application/json' } }).subscribe({
      next: () => {
        this.toastr.success('Usuário cadastrado com sucesso!', 'Conta criada');
      },
      error: (error) => {
          if (error.error.includes('E-mail'))
            this.toastr.error('Este e-mail já foi utilizado para cadastro!', 'Erro!');
          else if (error.error.includes('CPF'))
            this.toastr.error('Este Cpf já foi utilizado para cadastro!', 'Erro!');
          else if (error.error.includes('RG'))
            this.toastr.error('Este Rg já foi utilizado para cadastro!', 'Erro!');
        
            
      }
    })
  }
}
