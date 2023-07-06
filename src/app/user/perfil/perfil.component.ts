import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  form: FormGroup
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  disabledEdit: boolean = true;
  sim: Date = new Date();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.validation();
  }

  formatDate(input: string) {
    let valor = input;
    valor = valor.replace(/\D/g, '');

    const dia = valor.substr(0, 2);
    const mes = valor.substr(2, 2);
    const ano = valor.substr(4, 4);

    let dataFormatada = '';
    if (dia) {
      dataFormatada += dia;
      if (mes) {
        dataFormatada += '/' + mes;
        if (ano) {
          dataFormatada += '/' + ano;
        }
      }
    }

    input = dataFormatada;
    console.log(this.sim.getDate());
  }

  validation() {
    this.form = new FormGroup({
      nome: new FormControl({ value: '', disabled: this.disabledEdit }),
      email: new FormControl({ value: '', disabled: this.disabledEdit }),
      rg: new FormControl({ value: '', disabled: this.disabledEdit }),
      cpf: new FormControl({ value: '', disabled: this.disabledEdit }),
      nascimento: new FormControl({ value: '', disabled: this.disabledEdit }),
      sexo: new FormControl({ value: '', disabled: this.disabledEdit }),
      telefone: new FormControl({ value: '', disabled: this.disabledEdit }),
      senha: new FormControl({ value: '', disabled: this.disabledEdit }),
      confirmasenha: new FormControl({ value: '', disabled: this.disabledEdit }),
      cep: new FormControl({ value: '', disabled: this.disabledEdit }),
      endereco: new FormControl({ value: '', disabled: this.disabledEdit }),
      numero: new FormControl({ value: '', disabled: this.disabledEdit }),
      cidade: new FormControl({ value: '', disabled: this.disabledEdit }),
      estado: new FormControl({ value: '', disabled: this.disabledEdit }),
      complemento: new FormControl({ value: '', disabled: this.disabledEdit }),
    });
  }

  toggledisabledEdit() {
    if (this.form.get('nome').disabled) {
      this.form.get('nome').enable();
      this.form.get('email').enable();
      this.form.get('telefone').enable();
      this.form.get('senha').enable();
      this.form.get('confirmasenha').enable();
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
      this.form.get('senha').disable();
      this.form.get('confirmasenha').disable();
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
}
