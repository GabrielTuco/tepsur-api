import { Rol } from "../Auth/entity/Rol.entity";

export const isRoleValid = async (cod: number) => {
    const roleValid = await Rol.findOneBy({ uuid: cod });

    if (!roleValid) {
        throw new Error("Este rol no existe en la base de datos");
    }
    return true;
};
