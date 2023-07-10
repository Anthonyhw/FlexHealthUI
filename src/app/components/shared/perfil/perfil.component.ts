import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { ValidatorField } from 'src/app/helpers/validatorField';
import { UpdateUser } from 'src/app/models/updateuser.model';
import { User } from 'src/app/models/user.model';
import { env } from 'src/environments/environment';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  form: FormGroup;
  password: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  disabledEdit: boolean = true;
  updateStatus: boolean = false;
  userType: string;
  ufs: string[] = ['AC', 'AM', 'RR', 'PA', 'AP', 'TO', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'MG', 'ES', 'RJ', 'SP', 'PR', 'SC', 'RS', 'MS', 'MT', 'GO', 'DF',]
  especialidades: string[] = ['Cardiologia', 'Psicologia', 'Psquiatria', 'Neurologia', 'Endocrinologia', 'Dermatologia', 'Oftalmologia']

  get f(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: ToastrService, private cookie: CookieService) { }

  ngOnInit() {
    this.getUser()
  }

  validation(user: User) {
    const formOptions: AbstractControlOptions = {
      validators: [ValidatorField.checkName('nome')]
    };

    const passwordOptions: AbstractControlOptions = {
      validators: [ValidatorField.mustMatch('senha', 'confirmasenha')]
    };

    var endereco = user.endereco.split('\\');

    this.form = this.fb.group({
      nome: [{ value: user.nome, disabled: this.disabledEdit }, Validators.required],
      email: [{ value: user.email, disabled: this.disabledEdit }, [Validators.required, Validators.email]],
      telefone: [{ value: user.phoneNumber, disabled: this.disabledEdit }, [Validators.required, Validators.minLength(14), Validators.maxLength(15)]],
      cep: [{ value: endereco[0], disabled: this.disabledEdit }, Validators.required],
      endereco: [{ value: endereco[1], disabled: this.disabledEdit }, Validators.required],
      numero: [{ value: endereco[2], disabled: this.disabledEdit }, Validators.required],
      cidade: [{ value: endereco[3], disabled: this.disabledEdit }, Validators.required],
      estado: [{ value: endereco[4], disabled: this.disabledEdit }, Validators.required],
      complemento: [{ value: endereco[5], disabled: this.disabledEdit } || undefined],
    }, formOptions);

    if (user.roles.includes('Paciente')) {
      this.form.addControl('rg', new FormControl({ value: user.rg, disabled: this.disabledEdit }, [Validators.required, Validators.minLength(11)]))
      this.form.addControl('cpf', new FormControl({ value: user.cpf, disabled: this.disabledEdit }, [Validators.required, Validators.minLength(14)]))
      this.form.addControl('nascimento', new FormControl({ value: new Date(user.nascimento), disabled: this.disabledEdit }, Validators.required))
      this.form.addControl('genero', new FormControl({ value: user.genero, disabled: this.disabledEdit }, Validators.required))
    } else if (user.roles.includes('Estabelecimento')) {
      this.form.addControl('cnpj', new FormControl({ value: user.claims.find(c => c.type == 'CNPJ').value, disabled: this.disabledEdit }, [Validators.required, Validators.minLength(18)]))
      this.form.addControl('tipo', new FormControl({ value: user.claims.find(c => c.type == 'Tipo').value, disabled: this.disabledEdit }, Validators.required))
    } else {
      this.form.addControl('crm', new FormControl({ value: localStorage.getItem('doctor.Crm').substring(7, 13), disabled: this.disabledEdit }, [Validators.required, Validators.minLength(12)]))
      this.form.addControl('uf', new FormControl({value: localStorage.getItem('doctor.Crm').substring(4,6), disabled: this.disabledEdit},  Validators.required))
      this.form.addControl('especialidade', new FormControl({value: localStorage.getItem('doctor.Specialty'), disabled: this.disabledEdit}, Validators.required))
      this.form.addControl('genero', new FormControl({value: user.genero, disabled: this.disabledEdit}, Validators.required))
    }

    this.password = this.fb.group({
      senha: [{ value: '', disabled: this.disabledEdit },],
      confirmasenha: [{ value: '', disabled: this.disabledEdit }],
    }, passwordOptions);
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

    var x, y, z;
    if (valor.length == 10) {
      x = valor.substr(0, 2);
      y = valor.substr(2, 4);
      z = valor.substr(6, 4);
    } else {
      x = valor.substr(0, 2);
      y = valor.substr(2, 5);
      z = valor.substr(7, 4);
    }


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

  formatCnpj(input: any) {
    let valor = input.target.value;
    valor = valor.replace(/\D/g, '');

    const x = valor.substr(0, 2);
    const y = valor.substr(2, 3);
    const z = valor.substr(5, 3);
    const a = valor.substr(8, 4);
    const b = valor.substr(12, 2);

    let formatedPhone = '';
    if (x) {
      formatedPhone += x;
      if (y) {
        formatedPhone += '.' + y;
        if (z) {
          formatedPhone += '.' + z;
          if (a) {
            formatedPhone += '/' + a;
            if (b) {
              formatedPhone += '-' + b;
            }
          }
        }
      }
    }

    input.target.value = formatedPhone;
    this.f.telefone.value = formatedPhone;
  }

  onSubmit() {
    if (this.form.invalid || this.password.invalid) {
      this.toastr.error('Verifique os campos preenchidos.', 'Erro');
      return;
    }

    this.updateStatus = true;
    const update = new UpdateUser({
      userName: this.f.email.value,
      nome: this.f.nome.value,
      genero: this.f.genero?.value || '',
      nascimento: this.f.nascimento?.value || new Date(),
      rg: this.f.rg?.value || (this.f.crm?.value ? 'Medico' : 'Empresa'),
      cpf: this.f.cpf?.value || (this.f.crm?.value ? 'Medico' : 'Empresa'),
      phoneNumber: this.f.telefone.value,
      endereco: this.f.cep.value + '\\' + this.f.endereco.value + '\\' + this.f.numero.value + '\\' + this.f.cidade.value + '\\' + this.f.estado.value + '\\' + this.f.complemento.value,
      email: this.f.email.value,
      password: this.password.get('senha').value,
      token: '',
      cnpj: this.f.cnpj?.value || '',
      tipo: this.f.tipo?.value || '',
      crm: ('CRM-' + this.f.uf?.value + '/' + this.f.crm?.value) || '',
    });

    this.http.put(env.api + 'account/update', JSON.stringify(update)).subscribe({
      next: () => {
        this.toastr.success('Usuário atualizado com sucesso!', 'Conta atualizada');
      },
      error: (error) => {
        this.toastr.error('Não foi possível atualizar o usuário!', 'Erro');
        this.updateStatus = false;
      },
      complete: () => {
        this.updateStatus = false;
      }
    })
  }

  toggledisabledEdit() {
    if (this.form.get('nome').disabled) {
      this.form.get('nome').enable();
      this.form.get('email').enable();
      this.form.get('telefone').enable();
      this.password.get('senha').enable();
      this.password.get('confirmasenha').enable();
      this.form.get('cep').enable();
      this.form.get('endereco').enable();
      this.form.get('numero').enable();
      this.form.get('cidade').enable();
      this.form.get('estado').enable();
      this.form.get('complemento').enable();
      this.disabledEdit = false;
    } else {
      this.form.get('nome').disable();
      this.form.get('email').disable();
      this.form.get('telefone').disable();
      this.password.get('senha').disable();
      this.password.get('confirmasenha').disable();
      this.form.get('cep').disable();
      this.form.get('endereco').disable();
      this.form.get('numero').disable();
      this.form.get('cidade').disable();
      this.form.get('estado').disable();
      this.form.get('complemento').disable();
      this.disabledEdit = true;
    }
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getUser() {
    this.http.get(env.api + 'account/getuser').subscribe({
      next: (result: User) => {
        if (result.roles.includes('Medico')) this.userType = 'doctor'
        else if (result.roles.includes('Paciente')) this.userType = 'stablishment'
        else this.userType = 'patient'

        this.validation(result);
      },
      error: (error) => {
        this.toastr.error(error.error, 'Erro!');
      }
    })
  }

}
