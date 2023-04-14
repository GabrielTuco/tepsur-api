import { Secretaria } from "../entity/Secretaria.entity";
import { Sede } from "../../entity/Sede.entity";
import { SecretaryEntity, UserEntity } from "../../interfaces/entities";
import { Rol } from "../../Auth/entity/Rol.entity";
import { Usuario } from "../../Auth/entity/Usuario.entity";

export class SecretaryService {
    async register({
        codSede,
        dni,
        nombres,
        apeMaterno,
        apePaterno,
        celular,
        correo,
    }: SecretaryEntity) {
        try {
            const sede = await Sede.findOneBy({ id: codSede });
            if (sede) {
                const newSecretary = new Secretaria();
                newSecretary.dni = dni;
                newSecretary.nombres = nombres;
                newSecretary.ape_paterno = apePaterno;
                newSecretary.ape_materno = apeMaterno;
                newSecretary.celular = celular;
                newSecretary.correo = correo;
                newSecretary.sede = sede;
                const saved = await newSecretary.save();
                return saved;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async createUser({
        usuario,
        password,
        codRol,
        codSecretary,
    }: UserEntity & { codSecretary: number }) {
        try {
            const secretary = await Secretaria.findOneBy({ id: codSecretary });
            if (secretary) {
                const rol = await Rol.findOneBy({ id: codRol });
                const newUsuario = new Usuario();
                newUsuario.usuario = usuario;
                newUsuario.password = password;
                newUsuario.rol = rol!;
                const savedUsuario = await newUsuario.save();
                secretary.usuario = savedUsuario;

                const saved = await secretary.save();
                return saved;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async searchByUser(usuario: Usuario) {
        try {
            const secretaryExists = await Secretaria.createQueryBuilder("s")
                .innerJoinAndSelect("s.usuario", "u")
                .innerJoinAndSelect("u.rol", "r")
                .where("u.id= :id", { id: usuario.id })
                .getOne();
            return secretaryExists || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
