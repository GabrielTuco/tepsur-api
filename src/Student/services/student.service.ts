import { v4 as uuid } from "uuid";

import { Rol, Usuario } from "../../Auth/entity";
import { Direccion } from "../../entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Alumno } from "../entity/Alumno.entity";
import { StudentRepository } from "../interfaces/repositories";
import { encryptPassword } from "../../helpers/encryptPassword";
import { GradoEstudios, Matricula } from "../../Matricula/entity";
import { Sede } from "../../Sede/entity";
import { DireccionDto } from "../../Matricula/interfaces/dtos";
import { RegisterAlumnoDto } from "../interfaces/dtos";

export class StudentService implements StudentRepository {
    public register = async (data: RegisterAlumnoDto): Promise<Alumno> => {
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
            alumno.correo = dni;
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
    };

    public listBySede = async (sedeUuid: string): Promise<Matricula[]> => {
        try {
            const sede = await Sede.createQueryBuilder("s")
                .innerJoinAndSelect("s.matriculas", "m")
                .innerJoinAndSelect("m.carrera", "c")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("a.direccion", "d")
                .where("s.uuid=:uuid", { uuid: sedeUuid })
                .getOne();

            const alumnos = sede!.matriculas;

            return alumnos;
        } catch (error) {
            throw error;
        }
    };

    public createUser = async (uuid: string): Promise<Usuario> => {
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
            alumnoUsuario.usuario = alumno.correo;
            alumnoUsuario.password = encryptPassword(alumno.correo);
            alumnoUsuario.rol = rolExists;

            return await alumnoUsuario.save();
        } catch (error) {
            throw error;
        }
    };

    public searchByUuid = async (uuid: string): Promise<Alumno> => {
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
    };
    public searchByDni = async (dni: string): Promise<Alumno> => {
        try {
            const alumno = await Alumno.findOneBy({ correo: dni });
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
    };

    public searchByUser = async (usuario: Usuario) => {
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
    };

    public searchByEmail = async (correo: string) => {
        try {
            return Alumno.findOneBy({ correo });
        } catch (error) {
            throw error;
        }
    };

    public updateInfo = async (
        uuid: string,
        data: Partial<RegisterAlumnoDto>
    ): Promise<Alumno> => {
        try {
            const {
                apeMaterno,
                apePaterno,
                celular,
                celularReferencia,
                correo,
                direccion,
                dni,
                gradoEstudiosUuid,
                lugarResidencia,
                nombres,
                sexo,
            } = data;

            const alumno = await Alumno.createQueryBuilder("a")
                .innerJoinAndSelect("a.grado_estudios", "g")
                .innerJoinAndSelect("a.direccion", "d")
                .where("a.uuid=:uuid", { uuid })
                .getOne();

            if (!alumno)
                throw new DatabaseError(
                    "El alumno no existe",
                    404,
                    "Not found error"
                );
            const gradoEstudios = await GradoEstudios.findOneBy({
                uuid: gradoEstudiosUuid,
            });

            alumno.dni = dni!;
            alumno.nombres = nombres!;
            alumno.ape_materno = apeMaterno!;
            alumno.ape_paterno = apePaterno!;
            alumno.celular = celular!;
            alumno.celular_referencia = celularReferencia!;
            alumno.sexo = sexo!;
            if (alumno.correo !== correo) {
                const correoExists = await Alumno.findOneBy({ correo });
                if (correoExists)
                    throw new DatabaseError(
                        "El correo ya esta registrado",
                        403,
                        "Already exists"
                    );
                else alumno.correo = correo!;
            }
            alumno.lugar_residencia = lugarResidencia!;
            alumno.direccion.direccion_exacta = direccion?.direccionExacta!;
            alumno.direccion.distrito = direccion?.distrito!;
            alumno.direccion.provincia = direccion?.provincia!;
            alumno.direccion.departamento = direccion?.departamento!;
            alumno.grado_estudios = gradoEstudios!;

            await alumno.save();
            await alumno.reload();

            return alumno;
        } catch (error) {
            throw error;
        }
    };

    public registerAddressStudent = async (
        direccion: DireccionDto
    ): Promise<Direccion> => {
        try {
            const newDireccionAlumno = new Direccion();
            newDireccionAlumno.uuid = uuid();
            newDireccionAlumno.direccion_exacta = direccion.direccionExacta;
            newDireccionAlumno.distrito = direccion.distrito;
            newDireccionAlumno.provincia = direccion.provincia;
            newDireccionAlumno.departamento = direccion.departamento;

            return newDireccionAlumno;
        } catch (error) {
            throw error;
        }
    };

    public registerUserStudent = async (dni: string): Promise<Usuario> => {
        try {
            const rol = await Rol.findOneBy({ nombre: "Alumno" });

            const newUserAlumno = new Usuario();
            newUserAlumno.uuid = uuid();
            newUserAlumno.usuario = dni;
            newUserAlumno.password = encryptPassword(dni);
            newUserAlumno.rol = rol!;

            return newUserAlumno;
        } catch (error) {
            throw error;
        }
    };

    public registerStudent = async (
        alumno: RegisterAlumnoDto,
        newDireccionAlumno: Direccion,
        newUserAlumno: Usuario
    ) => {
        try {
            const gradoEstudios = await GradoEstudios.findOneBy({
                uuid: alumno.gradoEstudiosUuid,
            });

            const newAlumno = new Alumno();
            newAlumno.uuid = uuid();
            newAlumno.dni = alumno.dni;
            newAlumno.nombres = alumno.nombres;
            newAlumno.ape_materno = alumno.apeMaterno;
            newAlumno.ape_paterno = alumno.apePaterno;
            newAlumno.edad = alumno.edad;
            newAlumno.sexo = alumno.sexo;
            newAlumno.lugar_residencia = alumno.lugarResidencia;
            newAlumno.celular = alumno.celular;
            newAlumno.celular_referencia = alumno.celularReferencia;
            newAlumno.correo = alumno.correo;
            newAlumno.direccion = newDireccionAlumno;
            newAlumno.grado_estudios = gradoEstudios!;
            newAlumno.usuario = newUserAlumno;

            return newAlumno;
        } catch (error) {
            throw error;
        }
    };
}
