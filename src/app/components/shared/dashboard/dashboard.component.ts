import { Component, LOCALE_ID, TemplateRef } from '@angular/core';
import { Schedule } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ArchiveDto } from 'src/app/models/archiveDto.model';
import { PrescriptionService } from 'src/app/services/prescription.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  modalRef?: BsModalRef;
  func: string;

  openedSchedules: Schedule[] = [];
  scheduledSchedules: Schedule[] = [];
  closedSchedules: Schedule[] = [];
  selectedSchedule: Schedule;
  archives: ArchiveDto[] = [new ArchiveDto()];
  tipoExames = ['TSH e T4 livre', 'Transaminases ', 'Glicemia', 'Fezes', 'Urina', 'Papanicolau', 'Ureia e Creatinina', 'Colesterol', 'Hemograma'];
  confirmStatus: boolean = false;

  // Paginations
  page: number;

  constructor(private schedule: ScheduleService, private modalService: BsModalService, private toastr: ToastrService, private prescription: PrescriptionService) { }

  ngOnInit() {
    this.func = location.pathname.includes('doctor') ? 'getSchedulesByDoctorId' : 'GetSchedulesByPatientId'
    this.getSchedules(this.func)
  }

  getSchedules(func: string) {
    this.schedule[func](localStorage.getItem('User.Id')).subscribe({
      next: (result: Schedule[]) => {
        result.forEach((schedule) => {
          switch (schedule.status) {
            case 'Aberto':
              this.openedSchedules.push(schedule);
              break;
            case 'Agendado':
              this.scheduledSchedules.push(schedule);
              break;
            case 'Encerrado':
            case 'Cancelado':
              this.closedSchedules.push(schedule);
              break;
          }
        })
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  selectTab() {
    this.page = 1;
  }

  openModal(schedule: Schedule, template: TemplateRef<any>) {
    this.selectedSchedule = schedule;
    this.archives = [];
    this.archives.push(new ArchiveDto({
      medicoId: parseInt(localStorage.getItem('User.Id')),
      usuarioId: parseInt(this.selectedSchedule.usuario.id),
      agendamentoId: parseInt(this.selectedSchedule.id),

    }));
    this.modalRef = this.modalService.show(template,
      {
        class: 'modal-lg modal-dialog-centered',
        ignoreBackdropClick: true,
        keyboard: false
      });
  }

  confirm(requestType: string) {
    this.schedule[requestType](parseInt(this.selectedSchedule.id)).subscribe({
      next: () => {
        var message;
        if (requestType == 'deleteSchedule') {
          var index = this.openedSchedules.findIndex(sch => sch.id == this.selectedSchedule.id);
          this.openedSchedules.splice(index, 1);
          message = 'removido';
        } else {
          message = 'cancelado';
          var index = this.scheduledSchedules.findIndex(sch => sch.id == this.selectedSchedule.id);
          this.scheduledSchedules.splice(index, 1)
          this.selectedSchedule.status = 'Cancelado'
          this.closedSchedules.push(this.selectedSchedule)
        }
        this.toastr.success(`Agendamento ${message} com sucesso!`, 'Sucesso!');
        this.modalRef.hide();
      }
    })
  }

  decline() {
    this.modalRef.hide();
  }

  getAge(age: Date) {
    let timeDiff = Math.abs(Date.now() - new Date(age).getTime());
    let diffDays = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    return diffDays;
  }

  onFileChange(event: any, index: number) {

    var addNewSlot = true

    //var fileObject = event.target.files[0];

    this.archives[index].arquivo = event.target.files.length == 0 ? undefined : event.target.files[0];

    /*if (event.target.files > 0) {
      reader.readAsDataURL(this.archives[index].arquivo[0]);
    }*/


    this.archives.forEach(archive => {
      if (archive.arquivo == undefined) addNewSlot = false;
    })

    if (addNewSlot) this.archives.push(new ArchiveDto({
      medicoId: parseInt(localStorage.getItem('User.Id')),
      usuarioId: parseInt(this.selectedSchedule.usuario.id),
      agendamentoId: parseInt(this.selectedSchedule.id),

    }));
  }

  endSchedule() {
    this.confirmStatus = true
    var someError = false
    
    if (this.archives.length >= 1) {
      if (this.archives[this.archives.length - 1].arquivo == undefined) {
        this.archives.pop();
      }
    }
    if (this.archives.length > 0) {
      this.archives.forEach(arquivo => {
        if (!arquivo.arquivo) {
          this.archives.splice(this.archives.findIndex(arch => arch.arquivo == arquivo.arquivo), 1);
          return
        }
        if (arquivo.proposito == undefined) {
          this.toastr.error(`Escolha o tipo do arquivo ${arquivo.arquivo.name}`, 'Erro!')
          someError = true
        }
        if (arquivo.proposito == 'Pedido' && arquivo.tipoExame == undefined) {
          this.toastr.error(`Escolha o tipo de exame do arquivo ${arquivo.arquivo.name}`, 'Erro!')
          someError = true
        }
        if (arquivo.arquivo.type != '' && arquivo.arquivo.type != 'application/pdf') {
          this.toastr.error(`${arquivo.arquivo.name} deve ser do formato pdf`, 'Erro!')
          someError = true
        }
        arquivo.url = `${arquivo.proposito}${arquivo.tipoExame == undefined ? '' : '_' + arquivo.tipoExame}_${new Date().toLocaleDateString().toString().substring(0, 10).replaceAll('/', '-')}_user${arquivo.usuarioId}`;
      })
      if (someError) {
        this.confirmStatus = false;
        this.archives.push(new ArchiveDto());
        return;
      }
    }

    var request = new FormData();

    request.append('request.AgendamentoId', this.selectedSchedule.id);
    for (let i = 0; i < this.archives.length; i++) {
      request.append(`request.Arquivos[${i}].Arquivo`, this.archives[i].arquivo, this.archives[i].arquivo.name);
      request.append(`request.Arquivos[${i}].Url`, this.archives[i].url);
      request.append(`request.Arquivos[${i}].UsuarioId`, this.archives[i].usuarioId.toString());
      request.append(`request.Arquivos[${i}].MedicoId`, this.archives[i].medicoId.toString());
      request.append(`request.Arquivos[${i}].AgendamentoId`, this.archives[i].agendamentoId.toString());
      request.append(`request.Arquivos[${i}].Proposito`, this.archives[i].proposito);
      request.append(`request.Arquivos[${i}].TipoExame`, this.archives[i].tipoExame);
      request.append(`request.Arquivos[${i}].Visibilidade`, 'false');
    }

    this.schedule.endSchedule(request).subscribe({
      next: () => {
        this.selectedSchedule.status = 'Encerrado'
        this.closedSchedules.push(this.selectedSchedule);
        var index = this.scheduledSchedules.findIndex(sch => sch.id == this.selectedSchedule.id);
        this.scheduledSchedules.splice(index, 1);

        this.modalRef.hide()
        this.toastr.success('Agendamento finalizado com sucesso!');
      },
      error: (error) => {
        this.toastr.error(error.error, 'Erro!')
      }
    })
    this.confirmStatus = false
    this.archives.push(new ArchiveDto({}));
  }

  deleteFile(index) {
    this.archives.splice(index, 1);
  }

  uploadFile(archive: ArchiveDto) {
    if (archive.arquivo.type != 'application/pdf') {
      this.toastr.error('Escolha um arquivo do formato pdf!', 'Erro!');
      return
    }
    archive.url = `${archive.proposito}${archive.tipoExame == undefined ? '' : '_' + archive.tipoExame}_${new Date().toLocaleDateString().toString().substring(0, 10).replaceAll('/', '-')}_user${archive.usuarioId}`;
    var formData = new FormData();
    formData.append(`Arquivos[0].Arquivo`, archive.arquivo, archive.arquivo.name);
    formData.append(`Arquivos[0].Url`, archive.url);
    formData.append(`Arquivos[0].UsuarioId`, archive.usuarioId.toString());
    formData.append(`Arquivos[0].MedicoId`, archive.medicoId.toString());
    formData.append(`Arquivos[0].AgendamentoId`, archive.agendamentoId.toString());
    formData.append(`Arquivos[0].Proposito`, archive.proposito);
    formData.append(`Arquivos[0].TipoExame`, archive.tipoExame);
    formData.append(`Arquivos[0].Visibilidade`, 'false');

    this.prescription.CreatePrescription(formData).subscribe({
      next: (result) => {
        this.toastr.success('Arquivo enviado com sucesso!', 'Sucesso!')
        this.archives.splice(this.archives.findIndex(arch => arch == archive), 1);
      },
      error: (error) => { 
        this.toastr.error(error.error, 'Erro!')
      }
    })
  }
}
