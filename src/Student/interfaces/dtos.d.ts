import { Direccion } from "../../entity";
import { DireccionDto } from "../../Matricula/interfaces/dtos";

export interface StudentDTO {
    dni: string;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    sexo: "m" | "f";
    edad?: number;
    gradoEstudiosUuid?: string;
    lugarNacimiento?: string;
    celular?: string;
    correo?: string;
    direccion: DireccionDto;
}
