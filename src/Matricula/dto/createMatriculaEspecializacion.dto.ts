import { RegisterAlumnoDto } from "../../Student/interfaces/dtos";
import { MODALIDAD } from "../../interfaces/enums";
import { PagoMatriculaData } from "../interfaces/dtos";
import { CreateScheduleDTO } from "./createSchedule.dto";

export class CreateMatEspeDto {
    alumno: RegisterAlumnoDto;
    secretariaUuid: string;
    especializacionUuid: string;
    sedeUuid: string;
    horario: CreateScheduleDTO;
    fechaInscripcion: Date;
    fechaInicio: Date;
    pagoMatricula: PagoMatriculaData;
    modalidad: MODALIDAD;
}
