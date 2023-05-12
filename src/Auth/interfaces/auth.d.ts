import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Alumno } from "../../Student/entity/Alumno.entity";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { Administrador } from "../../entity";

export interface FindUserTypesDictionary {
    Secretaria: (u: Usuario) => Promise<Secretaria | null>;
    Docente: (u: Usuario) => Promise<Docente | null>;
    Administrador: (u: Usuario) => Promise<Administrador | null>;
    Alumno: (u: Usuario) => Promise<Administrador | null>; //TODO: check
}
