import { Component, OnInit } from '@angular/core';
import { Day } from 'src/app/models/day.model';
import { Appointment } from 'src/app/models/appointment.model';
import { ToastrService } from 'ngx-toastr';
import { Doctor } from 'src/app/models/doctor.model';
import { User } from 'src/app/models/user.model';
import { AccountService } from 'src/app/services/account.service';
import { Stablishment } from 'src/app/models/stablishment.model';
import { Agenda } from 'src/app/models/agenda';
import { ScheduleService } from 'src/app/services/schedule.service';
import { last } from 'rxjs';
import { env } from 'src/environments/environment';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {

  // Doctor Information
  doctor: Doctor;
  doctorImageSrc: string;

  today = new Date();
  dates: Day[] = [new Day(new Date(this.today))];
  currentDate = 0
  date: Day = this.dates[this.currentDate];
  weekDays: number[] = [];
  selectedHour: Date;

  // To Add Specific Hour
  public specificHour: Date;
  public specificValue: string;

  // To Add Hour Range
  public initialHour: Date;
  public finalHour: Date;
  public rangeValue: string;
  public interval: string;

  // to show information of the chosen time
  currentHour: Date;
  currentValue: string;

  ngOnInit() {
    this.getDoctorInformation();
  }

  constructor(private toastr: ToastrService, private account: AccountService, private schedule: ScheduleService) { }

  changeWeekDays(event: any, value: number) {

    if (!event.target.checked) {
      this.weekDays.push(value); // Adicionar value ao array quando o checkbox for marcado
    } else {
      const index = this.weekDays.indexOf(value);
      if (index > -1) {
        this.weekDays.splice(index, 1); // Remover value do array quando o checkbox for desmarcado
      }
    }
  }

  changeValue(z: Date[]) {

    var firstDate = new Date(z[0])
    var lastDate = new Date(z[1])
    lastDate.setDate(lastDate.getDate() + 1)
    var initial = firstDate.toLocaleDateString();
    var end = lastDate.toLocaleDateString();
    this.dates = [];

    const weekDaysString = this.weekDays.map(day => {
      switch (day) {
        case 0:
          return "Sun";
        case 1:
          return "Mon";
        case 2:
          return "Tue";
        case 3:
          return "Wed";
        case 4:
          return "Thu";
        case 5:
          return "Fri";
        case 6:
          return "Sat";
        default:
          return "";
      }
    }).join("|");

    const regex = new RegExp(`\\b(${weekDaysString})\\b`, "i");

    while (initial != end) {

      if (this.weekDays.length > 0 && regex.test(firstDate.toString())) {
        firstDate.setDate(firstDate.getDate() + 1);
        continue
      }

      this.dates.push(new Day(new Date(firstDate)))
      firstDate.setDate(firstDate.getDate() + 1);
      initial = firstDate.toLocaleDateString();
    }

    this.currentDate = 0;
    this.date = this.dates[this.currentDate];
  }

  advanceDate() {
    this.currentHour = undefined
    this.currentValue = undefined
    if (this.currentDate != this.dates.length - 1) this.date = this.dates[++this.currentDate];
  }

  rewindDate() {
    this.currentHour = undefined
    this.currentValue = undefined
    if (this.currentDate != 0) this.date = this.dates[--this.currentDate]
  }

  AddHour(hour: Date, value: string = '0.00') {
    hour.setDate(this.date.dia.getDate())
    if (Number.isNaN(value)) {
      this.toastr.error('Digite um valor válido!', 'Erro!');
      return
    }
    var already = false;

    this.date.horarios.forEach((date) => {
      if ((date.hora.getHours() == hour.getHours()) && (date.hora.getMinutes() == hour.getMinutes()))
        already = true
    })
    if (already) return
    this.date.horarios.push(new Appointment(hour, value));

    //sort by hour
    this.date.horarios.sort((a, b) => a.hora.getHours() - b.hora.getHours() || a.hora.getMinutes() - b.hora.getMinutes());
  }

  AddHourRange(initial: Date, end: Date, interval: string, value: string = '0.00') {
    if (Number.isNaN(value)) {
      this.toastr.error('Digite um valor válido!', 'Erro!');
      return
    }
    if (!initial || !end || !interval) return

    var currentHour = new Date(initial)
    currentHour.setMonth(this.date.dia.getMonth())
    currentHour.setDate(this.date.dia.getDate())
    var lastHour = new Date(end)
    lastHour.setMonth(this.date.dia.getMonth())
    lastHour.setDate(this.date.dia.getDate())
    lastHour.setMinutes(lastHour.getMinutes() + parseInt(interval))

    while ((currentHour.getHours() < lastHour.getHours()) || (currentHour.getMinutes() < lastHour.getMinutes())) {
      var already = false;

      this.date.horarios.forEach((date) => {
        if ((date.hora.getHours() == currentHour.getHours()) && (date.hora.getMinutes() == currentHour.getMinutes()))
          already = true
      })

      if (!already) {
        this.date.horarios.push(new Appointment(new Date(currentHour), value));
      }
      
      currentHour.setMinutes(currentHour.getMinutes() + parseInt(interval))
    }
    
    //sort by hour
    this.date.horarios.sort((a, b) => a.hora.getHours() - b.hora.getHours() || a.hora.getMinutes() - b.hora.getMinutes());
  }

  chooseHour(hour: Date) {
    this.date.horarios.forEach((schedule) => {
      if ((schedule.hora.getHours() == hour.getHours()) && (schedule.hora.getMinutes() == hour.getMinutes())) {
        this.currentHour = schedule.hora;
        this.currentValue = schedule.valor.toString();
        this.selectedHour = schedule.hora;
      }
    });
  }

  CurrencyFormat(value: string, input: string) {
    value = value.replaceAll(',', '.')
    var integer = parseFloat(value)
    var decimal = integer.toFixed(2);
    
    if (input == 'range') {
      this.rangeValue = decimal.toString();
    } else if (input == 'edit') {
      this.currentValue = decimal.toString();
    } else {
      this.specificValue = decimal.toString();
    }
  }

  editSchedule(hour: Date, value: string) {
    if (Number.isNaN(value)) {
      this.toastr.error('Digite um valor válido!', 'Erro!');
      return
    }
    var hourIndex = this.date.horarios.findIndex(sch => sch.hora.getHours() == this.selectedHour.getHours() && sch.hora.getMinutes() == this.selectedHour.getMinutes());
    if (hourIndex != -1) {
      var newHour = new Appointment(new Date(hour), value);

      if (this.date.horarios.find(sch => sch.hora.getHours() == newHour.hora.getHours() && sch.hora.getMinutes() == newHour.hora.getMinutes())) {
        this.toastr.error('Este horário já existe na agenda!', 'Erro!');
        return
      } else {
        this.date.horarios.splice(hourIndex, 1)
        this.date.horarios.push(newHour);
      }

      //sort by hour
      this.date.horarios.sort((a, b) => a.hora.getHours() - b.hora.getHours() || a.hora.getMinutes() - b.hora.getMinutes());

      this.toastr.success('Edição feita com sucesso!', 'Atualizado!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        tapToDismiss: true
      })
    }

  }

  removeSchedule(hour: Date) {
    var hourIndex = this.date.horarios.findIndex(sch => sch.hora == hour);
    if (hourIndex != -1) {
      this.date.horarios.splice(hourIndex, 1)
      this.currentHour = undefined
      this.currentValue = undefined
    }
  }

  getDoctorInformation() {

    // Getting Doctor Information
    this.account.getUser().subscribe({
      next: (result: User) => {
        this.doctor = new Doctor(result,
          {
            crm: localStorage.getItem('Doctor.Crm'),
            especialidade: localStorage.getItem('Doctor.Specialty')
          });
        this.doctorImageSrc = result.fotoPerfil ? env.api + `Resources/Images/UserImages/${result.fotoPerfil}` : '../../../../assets/nophoto.png';
        // Getting Stablishment Information
        this.account.getUserById(parseInt(localStorage.getItem('Doctor.Stablishment'))).subscribe({
          next: (result: User) => {
            this.doctor.estabelecimento = result;
          },
          error: (error) => { console.error(error.Message) }
        })
      },
      error: (error) => { console.error(error.Message) }
    })
  }

  onSubmit() {
    var hasSchedule = false;

    this.dates.forEach(date => {
      if (date.horarios.length > 0) hasSchedule = true
    }) 

    if (!hasSchedule) {
      this.toastr.error('Não há nenhum horário na agenda!')
      return
    }
    var request = new Agenda({
      tipo: this.doctor.estabelecimento.claims.find(claim => claim.type == 'Tipo').value == 'Consultorio' ? 'Consulta' : 'Exame',
      status: 'Aberto',
      medicoId: parseInt(localStorage.getItem('User.Id')),
      estabelecimentoId: parseInt(localStorage.getItem('Doctor.Stablishment')),
      especialidade: localStorage.getItem('Doctor.Specialty'),
      datas: this.dates
    })

    this.schedule.createSchedule(request).subscribe({
      next: (result) => {
        console.log(result)
        this.date = new Day(new Date());
        this.dates = []
        this.toastr.success('Agenda criada com sucesso!', 'Sucesso!')
      },
      error: (error) => {
        console.error(error.Message);
      }
    })
  }
}
