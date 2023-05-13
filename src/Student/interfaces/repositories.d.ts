import { Usuario } from "../../Auth/entity";
import { Alumno } from "../entity/Alumno.entity";
import { StudentDTO } from "./dtos";

export interface StudentRepository {
    register(data: StudentDTO): Promise<Alumno>;
    createUser(uuid: string): Promise<Usuario>;
    searchByUuid(uuid: string): Promise<Alumno>;
    searchByDni(dni: string): Promise<Alumno>;
    updateInfo(data: Partial<StudentDTO>): Promise<Alumno>;
}