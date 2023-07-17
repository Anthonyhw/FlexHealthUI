import { Appointment } from "./appointment.model";

export class Day {
    dia: Date;
    horarios: Appointment[] = []; 

    constructor(dia: Date) {
        this.dia = dia;
    }
}