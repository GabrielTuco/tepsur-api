import { Request, Response } from "express";
import { AdministratorService } from "../services/admin.service";
import { encryptPassword } from "../helpers/encryptPassword";

const administratorService = new AdministratorService();

export class AdministratorController {
    public async postAdministrator(req: Request, res: Response) {
        try {
            const administratorCreated = await administratorService.register(
                req.body
            );

            if (!administratorCreated) {
                return res.status(400).json({
                    msg: "No se pudo registrar al administrador",
                });
            }
            const administratorUserCreated =
                await administratorService.createUser({
                    adminUuid: administratorCreated.uuid,
                    codRol: 1,
                    usuario: administratorCreated.dni,
                    password: encryptPassword(administratorCreated.dni),
                });
            if (!administratorUserCreated) {
                return res.status(400).json({
                    msg: "No se pudo crear el usuario para el administrador",
                });
            }
            return res.json({
                administrator: administratorUserCreated,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
}
