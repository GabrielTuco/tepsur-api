import { DIAS } from "../../interfaces/enums";

export class CreateScheduleDTO {
    dias: DIAS[];
    horaInicio: string;
    horaFin: string;
}
