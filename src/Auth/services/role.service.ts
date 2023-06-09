import { Rol } from "../entity/Rol.entity";

export class RoleService {
    async listOfRoles() {
        try {
            const roles = await Rol.find({
                where: {
                    estado: true,
                },
            });
            return roles;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async registerRole(nombre: string) {
        try {
            const role = new Rol();
            role.nombre = nombre;
            const saved = await role.save();

            return saved;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async updateRole(uuid: number, nombre: string) {
        try {
            const role = await Rol.findOneBy({ uuid });
            if (role) {
                role.nombre = nombre;
                await role.save();
                return role;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async deleteRole(uuid: number) {
        try {
            const role = await Rol.findOneBy({ uuid });
            if (role) {
                role.estado = false;
                await role.save();
                return role;
            }
            return null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
