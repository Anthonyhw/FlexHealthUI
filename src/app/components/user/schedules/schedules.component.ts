import { Component } from '@angular/core';
import { AccordionConfig } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Agenda } from 'src/app/models/agenda';
import { ArchiveDto } from 'src/app/models/archiveDto.model';
import { Schedule } from 'src/app/models/schedule.model';
import { StablishmentAgenda } from 'src/app/models/stablishmentagenda.model';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { env } from 'src/environments/environment';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  providers: [{ provide: AccordionConfig, useValue: { isAnimated: true, closeOthers: true } }]
})
export class SchedulesComponent {

  date = new Date();
  stablishments: StablishmentAgenda[];
  specialty: string;
  city: string;
  scheduleType: string;
  paymentType: string;
  tipoConsultas = ['Cardiologia', 'Psicologia', 'Ginecologia', 'Pediatria', 'Oftalmologia', 'Psiquiatria']
  tipoExames = ['TSH e T4 livre', 'Transaminases', 'Glicemia', 'Fezes', 'Urina', 'Papanicolau', 'Ureia e Creatinina', 'Colesterol', 'Hemograma']
  selectedHour: Schedule;
  doctor: User;
  selectedPrescription: string;
  prescriptions: ArchiveDto[];
  numeros: number[] = Array.from({ length: 15 }, (_, index) => 24 + index)

  doctorImageSrc: string;
  stablishmentImageSrc: string;
  qrCodeSrc: string;


  foundResult: boolean = false;
  picanha: boolean = false;
  spinner: boolean;
  page: number = 1;
  modalRef?: BsModalRef;

  constructor(private schedule: ScheduleService, private account: AccountService, private toastr: ToastrService, private modalService: BsModalService, private prescription: PrescriptionService) { }

  ngOnInit() {
    this.getPrescriptions(parseInt(localStorage.getItem('User.Id')));
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
  }

  getSchedulesByCity(city: string) {
    this.spinner = true;
    this.foundResult = false;
    this.stablishments = undefined;
    this.schedule.getSchedulesByCity(city).subscribe({
      next: (result: StablishmentAgenda[]) => {

        this.spinner = false;
        this.stablishments = undefined
        this.page = 1
        this.stablishments = result;
        this.stablishments.forEach((stablishment) => {
          var index = 0;
          while (index <= stablishment.agenda.length - 1) {
            var formattedDate = this.date.toLocaleDateString();
            if (!new Date(stablishment.agenda[index].dataConsulta).toLocaleDateString().includes(formattedDate) || stablishment.agenda[index].tipo != this.scheduleType || stablishment.agenda[index].especialidade != this.specialty) {
              var start = stablishment.agenda.findIndex(h => h.id == stablishment.agenda[index].id);
              stablishment.agenda.splice(start, 1);
            } else index++;
          }
          stablishment.agenda.forEach((hour) => {
            var formattedDate = this.date.toLocaleDateString()
            if (!new Date(hour.dataConsulta).toLocaleDateString().includes(formattedDate) || hour.tipo != this.scheduleType || hour.especialidade != this.specialty) {
              var start = stablishment.agenda.findIndex(h => h.id == hour.id);
              stablishment.agenda.splice(start, 1);
            }
          })
          stablishment.agenda.sort((a, b) => parseInt(a.valor.split(' ')[1]) - parseInt(b.valor.split(' ')[1]))
        })
        var index = 0;
        while (index <= this.stablishments.length - 1) {
          if (this.stablishments[index].agenda.length == 0) {
            this.stablishments.splice(this.stablishments.findIndex(h => h.estabelecimento.id == this.stablishments[index].estabelecimento.id), 1)
          } else index++;
        }
        if (this.stablishments.length == 0) {
          this.foundResult = true
          this.stablishments = undefined
        } else {
          this.foundResult = false
        }
      },
      error: (error) => {
        console.error(error)
        this.spinner = false;
      }
    })
  }

  chooseHour(id: string) {
    this.stablishments.forEach(stablishment => {
      if (stablishment.agenda.find(stab => stab.id == id)) {
        this.selectedHour = stablishment.agenda.find(stab => stab.id == id)
        this.paymentType = '';
      }
    });

    this.account.getUserById(this.selectedHour.medicoId).subscribe({
      next: (result) => {

        this.doctor = result;
        var stablishmentPhoto = this.stablishments.find(stab => stab.agenda[0].medicoId == parseInt(result.id)).estabelecimento.fotoPerfil
        if (stablishmentPhoto != "") this.stablishmentImageSrc = env.api + `Resources/Images/UserImages/` + stablishmentPhoto;
        else this.stablishmentImageSrc = '../../../../assets/nophoto.png'

        if (result.fotoPerfil != "") this.doctorImageSrc = env.api + `Resources/Images/UserImages/${result.fotoPerfil}`;
        else this.doctorImageSrc = '../../../../assets/nophoto.png'

      }
    })
  }

  getStablishment() {
    return this.stablishments.find(stab => stab.estabelecimento.id == this.selectedHour.estabelecimentoId.toString()).estabelecimento
  }

  scheduleToUser(modal: any) {
    if (this.selectedHour.valor == 'R$ 0.00') {
      this.paymentType = 'Gratuito'
    }

    if (modal == 'Credit') {
      if ((<HTMLInputElement>document.getElementById('nomeTitular')).value == '' ||
        (<HTMLInputElement>document.getElementById('numeroCartao')).value == '' ||
        (<HTMLSelectElement>document.getElementById('mesValidade')).value == '' ||
        (<HTMLSelectElement>document.getElementById('anoValidade')).value == '' ||
        (<HTMLInputElement>document.getElementById('codigoSeguranca')).value == '') {
        this.toastr.error('Preencha todos os campos!');
        return
      }
    }

    if (this.scheduleType == 'Exame') {
      if (this.selectedPrescription != this.specialty) {
        this.toastr.error(`O pedido médico selecionado não está relacionado ao exame ${this.specialty}.`);
        return
      }
    }
    if (!this.paymentType || this.paymentType == '') {
      this.toastr.error('Escolha uma forma de pagamento!')
      return
    }
    if (this.paymentType == 'Credito' && modal != 'Credit') {
      this.modalRef = this.modalService.show(modal,
        {
          class: 'modal-lg modal-dialog-centered',
          ignoreBackdropClick: true,
          keyboard: false
        });
      return;
    }

    var request = {
      AgendamentoId: parseInt(this.selectedHour.id),
      UsuarioId: parseInt(localStorage.getItem('User.Id')),
      Pagamento: this.paymentType,
      StatusPagamento: this.paymentType == 'Credito' || this.paymentType == 'Gratuito' ? 'Pago' : 'Aguardando pagamento'
    }

    this.schedule.scheduleToUser(request).subscribe({
      next: (result) => {
        if (this.paymentType == 'Pix') {
          this.schedule.getQrCode(env.api + `schedule/approve?id=${this.selectedHour.id}`, this.selectedHour.id).subscribe({
            next: () => {
              this.qrCodeSrc = env.api + `Resources/QrCode/schedule${this.selectedHour.id}QRCode.png`
              this.modalRef = this.modalService.show(modal,
                {
                  class: 'modal-lg modal-dialog-centered',
                  ignoreBackdropClick: true,
                  keyboard: false
                });
            },
            error: (error) => {
              this.toastr.error(`Ocorreu um erro ao tentar agendar consulta: ${error.error}`)
            }
          })
        } else {
          this.toastr.success('Agendamento realizado com sucesso!', 'Sucesso!')
          this.paymentType = ''
          this.stablishments = []
          this.selectedHour = undefined;
          this.modalRef?.hide();
        }

      }
    })
  }

  getPrescriptions(id: number) {
    this.prescription.GetPrescriptionByUserId(id, false).subscribe({
      next: (result: ArchiveDto[]) => {
        this.prescriptions = result;
      },
      error: (error) => {
        this.toastr.error(`Erro ao recuperar prescrições: ${error.error}`, 'Erro');
      }
    })
  }
  closePix() {
    this.modalRef?.hide();
    this.paymentType = ''
    this.stablishments = []
    this.selectedHour = undefined;
  }
}
