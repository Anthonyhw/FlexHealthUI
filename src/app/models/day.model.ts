import { Schedule } from "./schedule.model";

export class Day {
    Day: Date;
    Schedules: Schedule[] = []; 

    constructor(day: Date) {
        this.Day = day;
    }
}