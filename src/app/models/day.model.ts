import { Schedule } from "./schedule.model";

export class Day {
    dia: Date;
    horarios: Schedule[] = []; 

    constructor(dia: Date) {
        this.dia = dia;
    }
}