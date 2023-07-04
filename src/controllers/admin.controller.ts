import { Request, Response } from "express";
import { AdministratorService } from "../services/admin.service";
import { encryptPassword } from "../helpers/encryptPassword";

export class AdministratorController {
    constructor(private readonly administratorService: AdministratorService) {}
    public postAdministrator = async (req: Request, res: Response) => {
        try {
            const administratorCreated =
                await this.administratorService.register(req.body);

            if (!administratorCreated) {
                return res.status(400).json({
                    msg: "No se pudo registrar al administrador",
                });
            }
            const administratorUserCreated =
                await this.administratorService.createUser({
                    adminUuid: administratorCreated.uuid,
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
    };
}
