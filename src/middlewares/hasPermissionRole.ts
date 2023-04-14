import { Rol } from "../Auth/entity/Rol.entity";

export const hasPermissionRole = async (codRole: number, validRole: string) => {
    const role = await Rol.findOne({ where: { nombre: validRole } });

    if (role!.id !== codRole) {
        throw new Error("No tienes privilegios para realizar esta operacion");
    }
    return true;
};
