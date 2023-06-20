import { TIPO_MATRICULA } from "../../interfaces/enums";

export interface ModuleDTO {
    nombre: string;
    duracionSemanas: string;
    horarioUuid: string;
    docenteUuid: string;
}

export interface HorarioDTO {
    horaInicio: string;
    horaFin: string;
    dias: string[];
}

export interface CareerDTO {
    numModulos: number;
    nombre: string;
    modulos: ModuleDTO[];
    horariosExistentes: string[]; //uuids
    horariosNuevos: HorarioDTO[];
    modalidad: string;
    duracionMeses: number;
}

export interface GroupDTO {
    nombre: string;
    fechaInicio: Date;
    horarioUuid: string;
    carreraUuid: string;
    docenteUuid: string;
    cuposMaximos: number;
}

enum Turno {
    "Mañana" = "Mañana",
    "Tarde" = "Tarde",
}

export interface ScheduleDTO {
    // turno: Turno;
    dias: string[];
    horaInicio: string;
    horaFin: string;
}

export type UpdateScheduleDTO = Partial<ScheduleDTO>;

export interface MatriculaDTO {
    alumno: AlumnoData;
    carreraUuid: string;
    horarioUuid: string;
    modulos: string[];
    secretariaUuid: string;
    sedeUuid: string;
    pagoMatricula: PagoMatriculaData;
    fechaInscripcion: Date;
    fechaInicio: Date;
    tipoMatricula: TIPO_MATRICULA;
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
