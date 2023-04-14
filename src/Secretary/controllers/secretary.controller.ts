import { Request, Response } from "express";

import { SecretaryService } from "../services/secretary.service";
import { encryptPassword } from "../../helpers/encryptPassword";

const secretaryService = new SecretaryService();

export const postSecretary = async (req: Request, res: Response) => {
    const { apeMaterno, apePaterno, celular, codSede, correo, dni, nombres } =
        req.body;
    try {
        //Registrar nueva secretaria
        const newSecretary = await secretaryService.register({
            codSede,
            dni,
            nombres,
            apePaterno,
            apeMaterno,
            celular,
            correo,
        });
        if (!newSecretary) {
            return res.status(400).json({
                msg: "No se pudo crear el registro",
            });
        }

        const newSecretaryUser = await secretaryService.createUser({
            usuario: newSecretary.dni,
            password: encryptPassword(newSecretary.dni),
            codRol: 2,
            codSecretary: newSecretary!.id,
        });

        return res.json({
            secretary: newSecretaryUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "contact the administrator",
        });
    }
};
