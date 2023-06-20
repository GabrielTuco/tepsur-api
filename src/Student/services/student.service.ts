import { v4 as uuid } from "uuid";

import { Rol, Usuario } from "../../Auth/entity";
import { Direccion } from "../../entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Alumno } from "../entity/Alumno.entity";
import { StudentDTO } from "../interfaces/dtos";
import { StudentRepository } from "../interfaces/repositories";
import { encryptPassword } from "../../helpers/encryptPassword";
import { GradoEstudios } from "../../Matricula/entity";

export class StudentService implements StudentRepository {
    public async register(data: StudentDTO): Promise<Alumno> {
        try {
            const {
                apeMaterno,
                apePaterno,
                celular,
                correo,
                direccion,
                dni,
                edad,
                gradoEstudiosUuid,
                lugarResidencia,
                nombres,
                sexo,
            } = data;

            const newDireccion = new Direccion();
            newDireccion.direccion_exacta = direccion.direccionExacta!;
            newDireccion.departamento = direccion.departamento!;
            newDireccion.distrito = direccion.distrito!;
            newDireccion.provincia = direccion.provincia!;

            const savedDireccion = await newDireccion.save();

            const gradoEstudiosExists = await GradoEstudios.findOneBy({
                uuid: gradoEstudiosUuid,
            });

            const alumno = new Alumno();

            alumno.ape_materno = apeMaterno;
            alumno.ape_paterno = apePaterno;
            alumno.celular = celular!;
            alumno.correo = correo!;
            alumno.direccion = savedDireccion;
            alumno.dni = dni;
            alumno.edad = edad!;
            alumno.grado_estudios = gradoEstudiosExists!;
            alumno.lugar_residencia = lugarResidencia!;
            alumno.nombres = nombres;
            alumno.sexo = sexo;
            alumno.uuid = uuid();

            return await alumno.save();
        } catch (error) {
            throw error;
        }
    }

    public async createUser(uuid: string): Promise<Usuario> {
        try {
            const alumno = await Alumno.findOneBy({ uuid });
            const rolExists = await Rol.findOneBy({ nombre: "Alumno" });
            if (!alumno || !rolExists) {
                throw new DatabaseError(
                    "No se puedo encontrar el registro en la base de datos",
                    404,
                    ""
                );
            }

            const alumnoUsuario = new Usuario();
            alumnoUsuario.usuario = alumno.dni;
            alumnoUsuario.password = encryptPassword(alumno.dni);
            alumnoUsuario.rol = rolExists;

            return await alumnoUsuario.save();
        } catch (error) {
            throw error;
        }
    }

    public async searchByUuid(uuid: string): Promise<Alumno> {
        try {
            const alumno = await Alumno.findOneBy({ uuid });
            if (!alumno) {
                throw new DatabaseError(
                    "No se puedo encontrar el registro",
                    404,
                    ""
                );
            }
            return alumno;
        } catch (error) {
            throw error;
        }
    }
    public async searchByDni(dni: string): Promise<Alumno> {
        try {
            const alumno = await Alumno.findOneBy({ dni });
            if (!alumno) {
                throw new DatabaseError(
                    "No se puedo encontrar el registro",
                    404,
                    ""
                );
            }
            return alumno;
        } catch (error) {
            throw error;
        }
    }

    public async searchByUser(usuario: Usuario) {
        try {
            const studentExists = await Alumno.createQueryBuilder("a")
                .innerJoinAndSelect("a.usuario", "u")
                .innerJoinAndSelect("u.rol", "r")
                .where("u.uuid= :id", { id: usuario.uuid })
                .getOne();

            if (!studentExists)
                throw new DatabaseError(
                    "Student not found",
                    500,
                    "Interal server error"
                );
            return studentExists;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    public async updateInfo(
        uuid: string,
        data: Partial<StudentDTO>
    ): Promise<Alumno> {
        try {
            const alumno = await Alumno.findOneBy({ uuid });
            if (!alumno) throw new DatabaseError("Alumno not found", 500, "");

            Object.assign(alumno, data);
            await alumno.save();
            await alumno.reload();

            return alumno;
        } catch (error) {
            throw error;
        }
    }
}
