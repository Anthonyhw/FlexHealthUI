import { Component, OnInit } from '@angular/core';
import { Day } from 'src/app/models/day.model';
import { Schedule } from 'src/app/models/schedule.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {

  today = new Date();
  dates: Day[] = [new Day(new Date(this.today))];
  currentDate = 0
  date: Day = this.dates[this.currentDate];
  weekDays: number[] = [];

  // To Add Specific Hour
  public specificHour: Date;
  public specificValue: number;

  // To Add Hour Range
  public initialHour: Date;
  public finalHour: Date;
  public rangeValue: number;
  public interval: string;

  // to show information of the chosen time
  currentHour: Date;
  currentValue: number;

  ngOnInit() {
  }

  constructor(private toastr: ToastrService) { }

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
      
      if (regex.test(firstDate.toString())) {
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

  AddHour(hour: Date, value: number = 0) {
    if (Number.isNaN(value)) {
      this.toastr.error('Digite um valor válido!', 'Erro!');
      return
    }
    var hourFormated = (hour.getHours() < 10 ? '0' + hour.getHours().toString() : hour.getHours().toString()) + ':' + (hour.getMinutes() < 10 ? '0' + hour.getMinutes().toString() : hour.getMinutes().toString())
    var already = false;

    this.date.Schedules.forEach((date) => {
      if ((date.hour.getHours() == hour.getHours()) && (date.hour.getMinutes() == hour.getMinutes()))
        already = true
    })
    if (already) return
    this.date.Schedules.push(new Schedule(hour, value));

    //sort by hour
    this.date.Schedules.sort((a, b) => a.hour.getHours() - b.hour.getHours() || a.hour.getMinutes() - b.hour.getMinutes());
  }

  AddHourRange(initial: Date, end: Date, interval: string, value: number = 0) {
    if (Number.isNaN(value)) {
      this.toastr.error('Digite um valor válido!', 'Erro!');
      return
    }
    if (!initial || !end || !interval) return

    var currentHour = new Date(initial)
    var lastHour = new Date(end)
    lastHour.setMinutes(lastHour.getMinutes() + parseInt(interval))

    while ((currentHour.getHours() < lastHour.getHours()) || (currentHour.getMinutes() < lastHour.getMinutes())) {
      var already = false;

      this.date.Schedules.forEach((date) => {
        if ((date.hour.getHours() == currentHour.getHours()) && (date.hour.getMinutes() == currentHour.getMinutes()))
          already = true
      })

      if (!already) {
        this.date.Schedules.push(new Schedule(new Date(currentHour), value));
      }

      currentHour.setMinutes(currentHour.getMinutes() + parseInt(interval))
    }

    //sort by hour
    this.date.Schedules.sort((a, b) => a.hour.getHours() - b.hour.getHours() || a.hour.getMinutes() - b.hour.getMinutes());
  }

  chooseHour(hour: Date) {
    this.date.Schedules.forEach((schedule) => {
      if ((schedule.hour.getHours() == hour.getHours()) && (schedule.hour.getMinutes() == hour.getMinutes())) {
        this.currentHour = schedule.hour;
        this.currentValue = schedule.value;
      }
    });
  }

  CurrencyFormat(value: number, input: string) {
    var decimal = parseInt(value.toString());
    var fixed = parseFloat(decimal.toFixed());

    if (input == 'range') {
      this.rangeValue = fixed;
    } else if (input == 'edit') {
      this.currentValue = fixed
    } else {
      this.specificValue = fixed;
    }
  }

  editSchedule(hour: Date, value: number) {
    if (Number.isNaN(value)) {
      this.toastr.error('Digite um valor válido!', 'Erro!');
      return
    }
    var hourIndex = this.date.Schedules.findIndex(sch => sch.hour == this.currentHour);
    if (hourIndex != -1) {
      this.date.Schedules.splice(hourIndex, 1)
      this.date.Schedules.push(new Schedule(new Date(hour), value))

      //sort by hour
      this.date.Schedules.sort((a, b) => a.hour.getHours() - b.hour.getHours() || a.hour.getMinutes() - b.hour.getMinutes());

      this.toastr.success('Edição feita com sucesso!', 'Atualizado!', {
        timeOut: 3000,
        positionClass: 'toast-bottom-right',
        tapToDismiss: true
      })
    }
    
  }

  removeSchedule(hour: Date) {
    var hourIndex = this.date.Schedules.findIndex(sch => sch.hour == hour);
    if (hourIndex != -1) {
      this.date.Schedules.splice(hourIndex, 1)
      this.currentHour = undefined
      this.currentValue = undefined
    }
  }
}
