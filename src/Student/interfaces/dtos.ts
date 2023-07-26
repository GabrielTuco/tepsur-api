import { DireccionDto } from "../../Matricula/interfaces/dtos";

export class RegisterAlumnoDto {
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
