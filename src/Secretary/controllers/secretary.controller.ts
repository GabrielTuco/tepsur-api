import { Request, Response } from "express";

import { SecretaryService } from "../services/secretary.service";
import { encryptPassword } from "../utilities/encryptPassword";

const secretaryService = new SecretaryService();

export const postSecretary = async (req: Request, res: Response) => {
    const {
        codSede,
        codRol,
        dni,
        nombres,
        apePaterno,
        apeMaterno,
        celular,
        correo,
    } = req.body;
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
                msg: "secretary was not created",
            });
        }

        const newSecretaryUser = await secretaryService.createUser({
            usuario: newSecretary.dni,
            password: encryptPassword(newSecretary.dni),
            codRol,
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
