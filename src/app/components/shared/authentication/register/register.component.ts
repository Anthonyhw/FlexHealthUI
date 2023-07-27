import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValidatorField } from '../../../../helpers/validatorField'
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { env } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Register } from 'src/app/models/register.model';
import jwtDecode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { FormatFieldsService } from 'src/app/services/format-fields.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  modalRef: BsModalRef;

  userType: string;
  data: Date;
  readonly = true;
  form: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  checkname: boolean;
  ufs: string[] = ['AC', 'AM', 'RR', 'PA', 'AP', 'TO', 'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA', 'MG', 'ES', 'RJ', 'SP', 'PR', 'SC', 'RS', 'MS', 'MT', 'GO', 'DF',]
  tipoConsultas = ['Cardiologia', 'Psicologia', 'Ginecologia', 'Pediatria', 'Oftalmologia', 'Psiquiatria']
  tipoExames = ['TSH e T4 livre', 'Transaminases', 'Glicemia', 'Fezes', 'Urina', 'Papanicolau', 'Ureia e Creatinina', 'Colesterol', 'Hemograma']
  specialty: string = localStorage.getItem('Stablishment.Type') || '';

  get f(): any {
    return this.form.controls;
  }

  public cep: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private toastr: ToastrService, private route: ActivatedRoute, private cookie: CookieService, public format: FormatFieldsService, private modalService: BsModalService) { }

  ngOnInit() {
    this.userType = location.pathname.split('/')[2] || 'patient';
    this.validation();
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
      telefone: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(15)]],
      senha: ['', [Validators.required, Validators.minLength(8)]],
      confirmasenha: ['', Validators.required],
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      complemento: [''],
      termos: [false, Validators.requiredTrue],
    }, formOptions);

    switch (this.userType) {
      case 'stablishment':
        this.form.addControl('cnpj', new FormControl('', [Validators.required, Validators.minLength(18)]))
        this.form.addControl('tipo', new FormControl('', Validators.required))
        break;
      case 'doctor':
        this.form.addControl('crm', new FormControl('', [Validators.required, Validators.minLength(6)]))
        this.form.addControl('uf', new FormControl('', Validators.required))
        this.form.addControl('especialidade', new FormControl('', Validators.required))
        break;
    }
    if (this.userType != 'stablishment') {
      this.form.addControl('rg', new FormControl('', [Validators.required, Validators.minLength(11)]))
      this.form.addControl('cpf', new FormControl('', [Validators.required, Validators.minLength(14)]))
      this.form.addControl('nascimento', new FormControl(new Date(), Validators.required))
      this.form.addControl('genero', new FormControl('', Validators.required))
    }
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

    var decodedToken = null
    if (location.pathname.includes('doctor')) decodedToken = jwtDecode<any>(this.cookie.get('Token'));

    const register = new Register({
      userName: this.f.email.value,
      nome: this.f.nome.value,
      genero: this.f.genero?.value || '',
      nascimento: this.f.nascimento?.value || new Date(),
      rg: this.f.rg?.value || (this.f.crm?.value ? 'Medico' : 'Empresa'),
      cpf: this.f.cpf?.value || (this.f.crm?.value ? 'Medico' : 'Empresa'),
      phoneNumber: this.f.telefone.value,
      endereco: this.f.cep.value + '\\' + this.f.endereco.value + '\\' + this.f.numero.value + '\\' + this.f.cidade.value + '\\' + this.f.estado.value + '\\' + this.f.complemento.value,
      email: this.f.email.value,
      password: this.f.senha.value,
      fotoPerfil: '',
      cnpj: this.f.cnpj?.value || '',
      tipo: this.userType == 'stablishment' ? this.f.tipo?.value : this.userType == 'doctor' ? 'Medico' : '',
      crm: ('CRM-' + this.f.uf?.value + '/' + this.f.crm?.value) || '',
      especialidade: this.f.especialidade?.value || '',
      estabelecimentoId: decodedToken?.nameid || null
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
        else if (error.error.includes('CRM'))
          this.toastr.error('Este CRM já foi utilizado para cadastro!', 'Erro!');
      }
    })
  }

  openTerms(terms:any) {
    this.modalRef = this.modalService.show(terms)
  }
}
