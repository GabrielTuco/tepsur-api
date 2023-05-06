import { Direccion } from "../../entity";

export interface StudentDTO {
    dni: string;
    nombres: string;
    apePaterno: string;
    apeMaterno: string;
    sexo: "m" | "f";
    edad?: number;
    estadoCivil?: string;
    gradoEstudios?: string;
    lugarNacimiento?: string;
    celular?: string;
    correo?: string;
    direccion: Partial<Direccion>;
}
