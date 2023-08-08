import { v4 as uuid } from "uuid";
import { Rol, Usuario } from "../Auth/entity";
import { Administrador } from "../entity";
import { Sede } from "../Sede/entity/Sede.entity";
import { NotFoundError } from "../errors/NotFoundError";
import { encryptPassword } from "../helpers/encryptPassword";
import { CreateAdminDto } from "../dtos/createAdmin.dto";
import { UpdateAdminDto } from "../dtos/updateAdmin.dto";
import { AlreadyExistsError } from "../errors/AlreadyExistsError";

export class AdministratorService {
    public register = async (data: CreateAdminDto) => {
        const {
            dni,
            apeMaterno,
            apePaterno,
            nombres,
            celular,
            correo,
            sedeUuid,
            usuario,
            password,
        } = data;
        try {
            const sede = await Sede.createQueryBuilder("s")
                .leftJoinAndSelect("s.administrador", "a")
                .where("s.uuid=:sedeUuid", { sedeUuid })
                .getOne();

            if (!sede) throw new NotFoundError("La sede no existe");
            if (sede.administrador) {
                throw new AlreadyExistsError(
                    "Solo se puede crear un usuario administrador por sede"
                );
            }

            const newAdministrator = new Administrador();
            newAdministrator.dni = dni;
            newAdministrator.uuid = uuid();
            newAdministrator.nombres = nombres;
            newAdministrator.ape_materno = apeMaterno;
            newAdministrator.ape_paterno = apePaterno;
            newAdministrator.celular = celular;
            newAdministrator.correo = correo;
            newAdministrator.sede = sede;

            newAdministrator.usuario = await this.createUser(usuario, password);

            return await newAdministrator.save();
        } catch (error) {
            throw error;
        }
    };

    public createUser = async (
        usuario: string,
        password: string
    ): Promise<Usuario> => {
        try {
            const newUser = new Usuario();
            const role = await Rol.findOneBy({ nombre: "Administrador" });

            if (!role) throw new NotFoundError("El rol no existe");
            newUser.uuid = uuid();
            newUser.usuario = usuario;
            newUser.password = encryptPassword(password);
            newUser.rol = role;

            const savedUser = await newUser.save();

            return savedUser;
        } catch (error) {
            throw error;
        }
    };

    public listAll = async (): Promise<{
        count: number;
        admins: Administrador[];
    }> => {
        try {
            const adminExists = await Administrador.createQueryBuilder("a")
                .innerJoinAndSelect("a.usuario", "u")
                .innerJoinAndSelect("u.rol", "r")
                .leftJoinAndSelect("a.sede", "s")
                .where("a.estado=true")
                .getManyAndCount();
            // if (!adminExists)
            //     throw new NotFoundError(
            //         "La persona no existe o se ha eliminado de la base de datos ;)"
            //     );

            return { admins: adminExists[0], count: adminExists[1] };
        } catch (error) {
            throw error;
        }
    };

    public searchByUuid = async (adminUuid: string): Promise<Administrador> => {
        try {
            const adminExists = await Administrador.createQueryBuilder("a")
                .innerJoinAndSelect("a.usuario", "u")
                .innerJoinAndSelect("u.rol", "r")
                .leftJoinAndSelect("a.sede", "s")
                .where("u.uuid= :id and a.estado=true", { id: adminUuid })
                .getOne();
            if (!adminExists)
                throw new NotFoundError(
                    "La persona no existe o se ha eliminado de la base de datos ;)"
                );

            return adminExists;
        } catch (error) {
            throw error;
        }
    };

    public searchByUser = async (user: Usuario): Promise<Administrador> => {
        try {
            const adminExists = await Administrador.createQueryBuilder("a")
                .innerJoinAndSelect("a.usuario", "u")
                .innerJoinAndSelect("u.rol", "r")
                .leftJoinAndSelect("a.sede", "s")
                .where("u.uuid= :id and a.estado=true", { id: user.uuid })
                .getOne();
            if (!adminExists)
                throw new NotFoundError(
                    "La persona no existe o se ha eliminado de la base de datos ;)"
                );

            return adminExists;
        } catch (error) {
            throw error;
        }
    };

    public updateAdmin = async (adminUuid: string, data: UpdateAdminDto) => {
        try {
            const admin = await this.searchByUuid(adminUuid);
            if (!admin) {
                throw new NotFoundError("EL administrador no existe");
            }
            const { nombres, dni, apeMaterno, apePaterno, correo, celular } =
                data;

            admin.dni = dni;
            admin.nombres = nombres;
            admin.ape_materno = apeMaterno;
            admin.ape_paterno = apePaterno;
            admin.celular = celular;
            admin.correo = correo;

            return admin.save();
        } catch (error) {
            throw error;
        }
    };

    public deleteAdmin = async (adminUuid: string) => {
        try {
            const admin = await this.searchByUuid(adminUuid);
            if (!admin) {
                throw new NotFoundError("EL administrador no existe");
            }
            admin.estado = false;

            return admin.save();
        } catch (error) {
            throw error;
        }
    };
}
