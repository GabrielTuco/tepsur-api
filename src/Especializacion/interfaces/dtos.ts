import {
    AlumnoData,
    HorarioDTO,
    PagoMatriculaData,
    ScheduleDTO,
} from "../../Matricula/interfaces/dtos";

export interface EspecializacionDTO {
    nombre: string;
    duracionSemanas: number;
    precio: number;
}

export interface MatEspeDTO {
    alumno: AlumnoData;
    secretariaUuid: string;
    especializacionUuid: string;
    sedeUuid: string;
    horario: ScheduleDTO;
    fechaInscripcion: Date;
    fechaInicio: Date;
    pagoMatricula: PagoMatriculaData;
}
