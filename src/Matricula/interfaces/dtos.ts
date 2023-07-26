import { RegisterAlumnoDto } from "../../Student/interfaces/dtos";
import {
    DIAS,
    MODALIDAD,
    TIPO_CARRERA,
    TIPO_MATRICULA,
} from "../../interfaces/enums";
import { Grupo, Matricula } from "../entity";

export class ModuleDTO {
    nombre: string;
    duracionSemanas: string;
    orden: number;
}

export class HorarioDTO {
    horaInicio: string;
    horaFin: string;
    dias: string[];
}

export class CareerDTO {
    nombre: string;
    modulos: ModuleDTO[];
    duracionMeses: number;
    tipoCarrera: TIPO_CARRERA;
    sedeUuid: string;
}

export class GroupDTO {
    nombre: string;
    fechaInicio: Date;
    modalidad: MODALIDAD;
    cuposMaximos: number;
    sedeUuid: string;
    horarioUuid: string;
    carreraUuid: string;
    docenteUuid: string;
    moduloUuid: string;
    responsableUuid: string;
}
export interface GrupoWithStudents extends Partial<Grupo> {
    students: Matricula[];
}

export class ScheduleDTO {
    dias: DIAS[];
    horaInicio: string;
    horaFin: string;
}

export type UpdateScheduleDTO = Partial<ScheduleDTO>;

export class ModuloMatriculaDTO {
    uuid: string;
    modalidad: MODALIDAD;
    fechaInicio: Date;
}
export class MatriculaDTO {
    alumno: RegisterAlumnoDto;
    carreraUuid: string;
    modulos: RegisterMatriculaModuloDto[];
    secretariaUuid: string;
    sedeUuid: string;
    pagoMatricula: PagoMatriculaData;
    fechaInscripcion: Date;
    tipoMatricula: TIPO_MATRICULA;
    fechaInicio: Date;
    modalidad: MODALIDAD;
}

export class UpdateMatriculaDto {
    alumno: Partial<RegisterAlumnoDto>;
    modulos: UpdateMatriculaModulosDto[];
}

export class UpdateMatriculaModulosDto {
    fechaInicio: Date;
    horarioUuid: string;
    modalidad: MODALIDAD;
    uuid: string;
}

export class RegisterMatriculaModuloDto {
    uuid: string;
    modalidad: MODALIDAD;
    fechaInicio: Date;
    horarioUuid: string;
}

export class TrasladoMatriculaDTO {
    alumno: RegisterAlumnoDto;
    carreraUuid: string;
    grupoUuid: string;
    moduloActualUuid: string;
    modulosCompletados: string[];
    secretariaUuid: string;
    sedeUuid: string;
    pagoMatricula: PagoMatriculaData;
    fechaInicio: Date;
}

export class DireccionDto {
    direccionExacta: string;
    distrito: string;
    provincia: string;
    departamento: string;
}

export class PagoMatriculaData {
    numComprobante: string;
    formaPagoUuid: number;
    monto: number;
}

export class GradoEstudiosDTO {
    descripcion: string;
}

export class TarifaPensionCarreraDTO {
    carreraUuid: string;
    tarifa: number;
}
