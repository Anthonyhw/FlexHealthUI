import { Component, LOCALE_ID, TemplateRef } from '@angular/core';
import { Schedule } from 'src/app/models/schedule.model';
import { ScheduleService } from 'src/app/services/schedule.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  modalRef?: BsModalRef;
  openedSchedules: Schedule[] = [];
  scheduledSchedules: Schedule[] = [];
  closedSchedules: Schedule[] = [];
  selectedSchedule: Schedule;

  // Paginations
  page: number;

  constructor(private schedule: ScheduleService, private modalService: BsModalService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getSchedules();
  }

  getSchedules() {
    this.schedule.getSchedulesByDoctorId(localStorage.getItem('User.Id')).subscribe({
      next: (result: Schedule[]) => {
        result.forEach((schedule) => {
          switch (schedule.status) {
            case 'Aberto':
              this.openedSchedules.push(schedule);
              break;
            case 'Agendado':
              this.scheduledSchedules.push(schedule);
              break;
            case 'Fechado':
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
          this.closedSchedules.push(this.selectedSchedule)
          var index = this.scheduledSchedules.findIndex(sch => sch.id == this.selectedSchedule.id);
          this.scheduledSchedules.splice(index, 1)
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
}
