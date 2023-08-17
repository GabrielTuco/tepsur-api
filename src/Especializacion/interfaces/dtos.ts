import { CreateScheduleDTO } from "../../Matricula/dto/createSchedule.dto";
import { PagoMatriculaData } from "../../Matricula/interfaces/dtos";
import { RegisterAlumnoDto } from "../../Student/interfaces/dtos";
import { MODALIDAD } from "../../interfaces/enums";

export class EspecializacionDTO {
    nombre: string;
    duracionSemanas: number;
    precio: number;
}

export class MatEspeDTO {
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
