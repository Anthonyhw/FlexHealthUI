import { Component } from '@angular/core';
import { AccordionConfig } from 'ngx-bootstrap/accordion';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  providers: [ { provide: AccordionConfig, useValue: { isAnimated: true, closeOthers: true }}]
})
export class SchedulesComponent {
  today = new Date();

  formatDate(input:string) {
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
}
