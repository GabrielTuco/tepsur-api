export interface ModuleDTO {
    nombre: string;
    duracionSemanas: string;
}

export interface CareerDTO {
    numModulos: number;
    nombre: string;
    modulosUuids: string[];
}

export interface GroupDTO {
    nombre: string;
    fechaInicio: Date;
    horarioUuid: string;
    carreraUuid: string;
}
