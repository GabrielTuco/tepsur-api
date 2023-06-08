import { v4 as uuid } from "uuid";
import { Rol, Usuario } from "../../Auth/entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { Docente } from "../entity/Docente.entity";
import { TeacherSchema } from "../interfaces/teacher";

export class TeacherService {
    public async listAll() {
        try {
            const data = await Docente.find();
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async register({
        apeMaterno,
        apePaterno,
        dni,
        nombres,
        sedeUuid,
    }: TeacherSchema) {
        try {
            const newTeacher = new Docente();
            const sedeExists = await Sede.findOneBy({ uuid: sedeUuid });

            if (sedeExists) {
                newTeacher.uuid = uuid();
                newTeacher.dni = dni;
                newTeacher.nombres = nombres;
                newTeacher.ape_materno = apeMaterno;
                newTeacher.ape_paterno = apePaterno;
                newTeacher.sede = sedeExists!;
                return await newTeacher.save();
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async createUser(
        usuario: string,
        password: string,
        codRol: number,
        teacherUuid: string
    ) {
        try {
            const teacher = await Docente.findOneBy({ uuid: teacherUuid });
            if (teacher) {
                const rol = await Rol.findOneBy({ uuid: codRol });
                if (rol) {
                    const newUsuario = new Usuario();
                    newUsuario.usuario = usuario;
                    newUsuario.password = password;
                    newUsuario.rol = rol;

                    const savedUsuario = await newUsuario.save();
                    teacher.usuario = savedUsuario;

                    await teacher.save();

                    return await this.searchByUser(savedUsuario);
                }
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    public async searchByUser(usuario: Usuario) {
        try {
            const teacherExists = await Docente.createQueryBuilder("d")
                .innerJoinAndSelect("d.usuario", "u")
                .innerJoinAndSelect("u.rol", "r")
                .innerJoinAndSelect("d.sede", "s")
                .where("u.uuid= :id", { id: usuario.uuid })
                .getOne();
            return teacherExists || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
