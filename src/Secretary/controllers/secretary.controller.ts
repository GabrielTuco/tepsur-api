import { Request, Response } from "express";

import { SecretaryService } from "../services/secretary.service";
import { encryptPassword } from "../../helpers/encryptPassword";
import { DatabaseError } from "../../errors/DatabaseError";

const secretaryService = new SecretaryService();

export class SecretaryController {
    public async postSecretary(req: Request, res: Response) {
        try {
            //Registrar nueva secretaria
            const newSecretary = await secretaryService.register(req.body);
            if (!newSecretary) {
                return res.status(400).json({
                    msg: "No se pudo crear el registro",
                });
            }

            const newSecretaryWithUser = await secretaryService.createUser({
                usuario: newSecretary.dni,
                password: encryptPassword(newSecretary.dni),
                codRol: 2,
                codSecretary: newSecretary!.id,
            });

            return res.json({
                secretary: newSecretaryWithUser,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "contact the administrator",
            });
        }
    }

    public async patchSecretary(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const updatedSecretary = await secretaryService.update(
                parseInt(id),
                req.body
            );
            if (!updatedSecretary) {
                return res.status(400).json({
                    msg: "No se pudo actualizar el registro",
                });
            }
            return res.json({
                updatedSecretary,
            });
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
        }
    }
}
