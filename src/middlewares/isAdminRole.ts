import { CustomValidator } from "express-validator";
import { Rol } from "../Auth/entity/Rol.entity";

export const isAdminRole: CustomValidator = async (codRol: number) => {
    const role = await Rol.findOne({
        where: {
            nombre: "Administrador",
        },
    });

    if (role!.id !== codRol) {
        throw new Error("No tienes privilegios para realizar esta operacion");
    }
    return true;
};
