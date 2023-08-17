import { DIAS, TIPO_HORARIO } from "../../interfaces/enums";

export class CreateScheduleDTO {
    dias: DIAS[];
    horaInicio: string;
    horaFin: string;
    tipo: TIPO_HORARIO;
}
