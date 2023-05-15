export interface ModuleDTO {
    nombre: string;
    duracionSemanas: string;
}

export interface CareerDTO {
    numModulos: number;
    nombre: string;
    modulos: ModuleDTO[];
    modalidad: string;
}

export interface GroupDTO {
    nombre: string;
    fechaInicio: Date;
    horarioUuid: string;
    carreraUuid: string;
    docenteUuid: string;
}

enum ScheduleDays {
    "L-V" = "L-V",
    "S-D" = "S-D",
}

enum Turno {
    "Mañana" = "Mañana",
    "Tarde" = "Tarde",
}

export interface ScheduleDTO {
    turno: Turno;
    dias: ScheduleDays;
    horaInicio: number;
    horaFin: number;
}

export type UpdateScheduleDTO = Partial<ScheduleDTO>;
