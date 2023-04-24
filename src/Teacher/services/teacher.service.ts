import { Rol, Usuario } from "../../Auth/entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { Docente } from "../../entity";
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
        sede,
    }: TeacherSchema) {
        try {
            const newTeacher = new Docente();
            const sedeExists = await Sede.findOneBy({ id: sede });

            if (sedeExists) {
                newTeacher.ape_materno = apeMaterno;
                newTeacher.ape_paterno = apePaterno;
                newTeacher.dni = dni;
                newTeacher.nombres = nombres;
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
        codTeacher: number
    ) {
        try {
            const teacher = await Docente.findOneBy({ id: codTeacher });
            if (teacher) {
                const rol = await Rol.findOneBy({ id: codRol });
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
                .where("u.id= :id", { id: usuario.id })
                .getOne();
            return teacherExists || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
