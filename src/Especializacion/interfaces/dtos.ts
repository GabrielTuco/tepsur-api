import {
    AlumnoData,
    HorarioDTO,
    PagoMatriculaData,
    ScheduleDTO,
} from "../../Matricula/interfaces/dtos";
import { MODALIDAD } from "../../interfaces/enums";

export class EspecializacionDTO {
    nombre: string;
    duracionSemanas: number;
    precio: number;
}

export class MatEspeDTO {
    alumno: AlumnoData;
    secretariaUuid: string;
    especializacionUuid: string;
    sedeUuid: string;
    horario: ScheduleDTO;
    fechaInscripcion: Date;
    fechaInicio: Date;
    pagoMatricula: PagoMatriculaData;
    modalidad: MODALIDAD;
}
