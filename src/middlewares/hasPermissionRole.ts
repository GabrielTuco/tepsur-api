import { Rol } from "../Auth/entity/Rol.entity";
import { ROLES } from "../interfaces/enums";

export const hasPermissionRole = async (
    codRole: number,
    validRoles: ROLES[]
) => {
    const roles = await Promise.all(
        validRoles.map(async (role) => await Rol.findOneBy({ nombre: role }))
    );

    const roleExists = roles
        .filter((role) => role !== null)
        .map((role) => role?.id) as number[];

    if (!roleExists.includes(codRole)) {
        throw new Error("No tienes privilegios para realizar esta operacion");
    }
    return true;
};
