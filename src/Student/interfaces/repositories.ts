import { Usuario } from "../../Auth/entity";
import { Alumno } from "../entity/Alumno.entity";
import { StudentDTO } from "./dtos";

export interface StudentRepository {
    register(data: StudentDTO): Promise<Alumno>;
    createUser(uuid: string): Promise<Usuario>;
    listBySede(sedeUuid: string): Promise<Alumno[]>;
    searchByUuid(uuid: string): Promise<Alumno>;
    searchByDni(dni: string): Promise<Alumno>;
    updateInfo(uuid: string, data: Partial<StudentDTO>): Promise<Alumno>;
}
