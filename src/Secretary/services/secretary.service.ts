import { v4 as uuid } from "uuid";
import { Secretaria } from "../entity/Secretaria.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { Rol } from "../../Auth/entity/Rol.entity";
import { Usuario } from "../../Auth/entity/Usuario.entity";
import {
    CreateSecretaryUserDTO,
    CreateSecretaryDTO,
} from "../interfaces/secretary.dto";
import { SecretaryRepository } from "../interfaces/repositories";
import { DatabaseError } from "../../errors/DatabaseError";

export class SecretaryService implements SecretaryRepository {
    public async register({
        sedeUuid,
        dni,
        nombres,
        apeMaterno,
        apePaterno,
        celular,
        correo,
    }: CreateSecretaryDTO) {
        try {
            const sede = await Sede.findOneBy({ uuid: sedeUuid });
            if (!sede) throw new DatabaseError("Sede not found", 404, "");

            const newSecretary = new Secretaria();
            newSecretary.dni = dni;
            newSecretary.uuid = uuid();
            newSecretary.nombres = nombres;
            newSecretary.ape_paterno = apePaterno;
            newSecretary.ape_materno = apeMaterno;
            newSecretary.celular = celular;
            newSecretary.correo = correo;
            newSecretary.sede = sede;
            const saved = await newSecretary.save();
            return saved;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    public async createUser({
        usuario,
        password,
        codRol,
        secretaryUuid,
    }: CreateSecretaryUserDTO) {
        try {
            const secretary = await Secretaria.findOneBy({
                uuid: secretaryUuid,
            });
            if (!secretary)
                throw new DatabaseError("Secretaria not found", 404, "");

            const rol = await Rol.findOneBy({ uuid: codRol });
            const newUsuario = new Usuario();
            newUsuario.uuid = uuid();
            newUsuario.usuario = usuario;
            newUsuario.password = password;
            newUsuario.rol = rol!;
            const savedUsuario = await newUsuario.save();
            secretary.usuario = savedUsuario;

            const saved = await secretary.save();
            return saved;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    public async searchByUser(usuario: Usuario) {
        try {
            const secretaryExists = await Secretaria.createQueryBuilder("s")
                .innerJoinAndSelect("s.usuario", "u")
                .innerJoinAndSelect("u.rol", "r")
                .innerJoinAndSelect("s.sede", "se")
                .innerJoinAndSelect("se.direccion", "d")
                .where("u.uuid= :id", { id: usuario.uuid })
                .getOne();

            if (!secretaryExists)
                throw new DatabaseError("Secretary not found", 404, "");
            return secretaryExists;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async update(
        uuid: string,
        data: Partial<Secretaria>
    ): Promise<Secretaria> {
        try {
            const secretary = await Secretaria.findOneBy({ uuid });
            if (!secretary)
                throw new DatabaseError("Secretaria not found", 404, "");

            Object.assign(secretary, data);

            await secretary.save();
            await secretary.reload();

            return secretary;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
