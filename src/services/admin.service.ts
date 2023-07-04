import { v4 as uuid } from "uuid";
import { Rol, Usuario } from "../Auth/entity";
import { Administrador } from "../entity";
import { DatabaseError } from "../errors/DatabaseError";
import { UserEntity } from "../interfaces/entities";
import { AdministratorDTO } from "../interfaces/schemas";
import { Sede } from "../Sede/entity/Sede.entity";

export class AdministratorService {
    public register = async (data: AdministratorDTO) => {
        const {
            dni,
            apeMaterno,
            apePaterno,
            nombres,
            celular,
            correo,
            sedeUuid,
        } = data;
        try {
            const sede = await Sede.findOneBy({ uuid: sedeUuid });

            if (!sede)
                throw new DatabaseError(
                    "Sede not found",
                    404,
                    "Not found error"
                );

            const newAdministrator = new Administrador();
            newAdministrator.dni = dni;
            newAdministrator.uuid = uuid();
            newAdministrator.nombres = nombres;
            newAdministrator.ape_materno = apeMaterno;
            newAdministrator.ape_paterno = apePaterno;
            newAdministrator.celular = celular;
            newAdministrator.correo = correo;
            newAdministrator.sede = sede;

            return await newAdministrator.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    public createUser = async ({
        adminUuid,
        password,
        usuario,
    }: UserEntity & { adminUuid: string }) => {
        try {
            const administrator = await Administrador.findOneBy({
                uuid: adminUuid,
            });
            if (administrator) {
                const newUser = new Usuario();
                const role = await Rol.findOneBy({ nombre: "Administrador" });

                if (!role)
                    throw new DatabaseError(
                        "Rol not valid or not found",
                        404,
                        "Not found error"
                    );
                newUser.uuid = uuid();
                newUser.usuario = usuario;
                newUser.password = password;
                newUser.rol = role;

                const savedUser = await newUser.save();
                administrator.usuario = savedUser;

                return await administrator.save();
            }
        } catch (error) {
            console.log(error);
            throw new Error("Error creando el usuario para el administrador");
        }
    };
    public searchByUser = async (usuario: Usuario) => {
        try {
            const adminExists = await Administrador.createQueryBuilder("a")
                .innerJoinAndSelect("a.usuario", "u")
                .innerJoinAndSelect("u.rol", "r")
                .leftJoinAndSelect("a.sede", "s")
                .where("u.uuid= :id", { id: usuario.uuid })
                .getOne();
            return adminExists || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    };
}
