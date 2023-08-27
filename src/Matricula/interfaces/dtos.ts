import { RegisterAlumnoDto } from "../../Student/interfaces/dtos";
import {
    DIAS,
    MODALIDAD,
    TIPO_CARRERA,
    TIPO_ENTIDAD_FINANCIERA,
    TIPO_MATRICULA,
} from "../../interfaces/enums";
import { Grupo, Matricula } from "../entity";

export class HorarioDTO {
    horaInicio: string;
    horaFin: string;
    dias: string[];
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
    moduloUuid: string;
    modalidad: MODALIDAD;
    uuid: string;
}

export class RegisterMatriculaModuloDto {
    uuid: string;
    modalidad: MODALIDAD;
    fechaInicio: Date;
    horarioUuid: string;
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
    fecha: Date;
    hora: string;
    entidad: TIPO_ENTIDAD_FINANCIERA;
}

export class GradoEstudiosDTO {
    descripcion: string;
}
