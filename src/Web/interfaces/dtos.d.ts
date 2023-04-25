export interface ModuloDTO {
    nombre: string;
    descripcion: string;
    urlVideo: string;
    images: string[];
}

export interface CarreraDTO {
    nombre: string;
    descripcion: string;
    perfilEgreso: string;
    fechaInicio: Date;
    finInscripcion: Date;
    duracionMeses: string;
    images: string[];
    urlVideo: string[];
    modulos: string[];
}
