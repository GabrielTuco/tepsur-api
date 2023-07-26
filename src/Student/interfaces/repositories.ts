import { Usuario } from "../../Auth/entity";
import { Matricula } from "../../Matricula/entity";
import { Alumno } from "../entity/Alumno.entity";
import { RegisterAlumnoDto } from "./dtos";

export interface StudentRepository {
    register(data: RegisterAlumnoDto): Promise<Alumno>;
    createUser(uuid: string): Promise<Usuario>;
    listBySede(sedeUuid: string): Promise<Matricula[]>;
    searchByUuid(uuid: string): Promise<Alumno>;
    searchByDni(dni: string): Promise<Alumno>;
    updateInfo(uuid: string, data: Partial<RegisterAlumnoDto>): Promise<Alumno>;
}
