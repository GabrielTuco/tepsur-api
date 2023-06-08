import { Request, Response } from "express";
import { UserService } from "../Auth/services/user.service";
import { ROLES } from "../interfaces/enums";
import { Rol } from "../Auth/entity";

const userService = new UserService();

declare module "express-serve-static-core" {
    interface Request {
        id: string;
        user: string;
    }
}

export const checkAuthRole =
    (roles: ROLES[]) => async (req: Request, res: Response, next: Function) => {
        try {
            const usuario = await userService.findById(req.id);
            if (!usuario)
                return res.status(404).json({ message: "User not valid" });

            const codRole = usuario.rol.uuid;

            const rolesArr = await Promise.all(
                roles.map(async (role) => await Rol.findOneBy({ nombre: role }))
            );

            const roleExists = rolesArr
                .filter((role) => role !== null)
                .map((role) => role?.uuid) as number[];

            if (!roleExists.includes(codRole)) {
                return res.status(401).json({
                    msg: "No tienes privilegios para realizar esta operacion",
                });
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error contact the administrator",
            });
        }
    };
