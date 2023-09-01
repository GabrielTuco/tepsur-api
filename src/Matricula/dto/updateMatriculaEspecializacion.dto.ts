import { RegisterAlumnoDto } from "../../Student/interfaces/dtos";
import { MODALIDAD } from "../../interfaces/enums";
import { CreateScheduleDTO } from "./createSchedule.dto";

export class UpdateMatEspeDto {
    alumno: RegisterAlumnoDto;
    horario: CreateScheduleDTO;
    fechaInicio: Date;
    modalidad: MODALIDAD;
}
