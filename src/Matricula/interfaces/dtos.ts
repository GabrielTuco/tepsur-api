import {
    DIAS,
    MODALIDAD,
    TIPO_CARRERA,
    TIPO_MATRICULA,
} from "../../interfaces/enums";
import { Grupo, Horario, Matricula } from "../entity";

export interface ModuleDTO {
    nombre: string;
    duracionSemanas: string;
    orden: number;
}

export interface HorarioDTO {
    horaInicio: string;
    horaFin: string;
    dias: string[];
}

export interface CareerDTO {
    nombre: string;
    modulos: ModuleDTO[];
    duracionMeses: number;
    tipoCarrera: TIPO_CARRERA;
    sedeUuid: string;
}

export interface GroupDTO {
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

export interface ScheduleDTO {
    dias: DIAS[];
    horaInicio: string;
    horaFin: string;
}

export type UpdateScheduleDTO = Partial<ScheduleDTO>;

export interface ModuloMatriculaDTO {
    uuid: string;
    modalidad: MODALIDAD;
    fechaInicio: Date;
}
export interface MatriculaDTO {
    alumno: AlumnoData;
    carreraUuid: string;
    modulos: {
        uuid: string;
        modalidad: MODALIDAD;
        fechaInicio: Date;
        horarioUuid: string;
    }[];
    secretariaUuid: string;
    sedeUuid: string;
    pagoMatricula: PagoMatriculaData;
    fechaInscripcion: Date;
    tipoMatricula: TIPO_MATRICULA;
    fechaInicio: Date;
    modalidad: MODALIDAD;
}

export interface TrasladoMatriculaDTO {
    alumno: AlumnoData;
    carreraUuid: string;
    grupoUuid: string;
    moduloActualUuid: string;
    modulosCompletados: string[];
    secretariaUuid: string;
    sedeUuid: string;
    pagoMatricula: PagoMatriculaData;
    fechaInicio: Date;
}

export interface AlumnoData {
    dni: string;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    sexo: "m" | "f";
    edad: number;
    gradoEstudiosUuid: number;
    lugarResidencia: string;
    celular: string;
    celularReferencia: string;
    correo: string;
    direccion: DireccionDto;
}

export interface DireccionDto {
    direccionExacta: string;
    distrito: string;
    provincia: string;
    departamento: string;
}

export interface PagoMatriculaData {
    numComprobante: string;
    formaPagoUuid: number;
    monto: number;
}

export interface GradoEstudiosDTO {
    descripcion: string;
}

export interface TarifaPensionCarreraDTO {
    carreraUuid: string;
    tarifa: number;
}
