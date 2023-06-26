import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { UserService } from "../services/user.service";

const userService = new UserService();

export class UserController {
    public async getAllUsers(_req: Request, res: Response) {
        try {
            const users = await userService.listUsers();

            return res.json(users);
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                err: "Ocurrio un error",
            });
        }
    }

    public async patchUserAvatar(req: Request, res: Response) {
        const { id } = req.params;

        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).json({ msg: "No hay imagen para subir." });
                return;
            }

            if (!req.files.image || Object.keys(req.files).length === 0) {
                res.status(400).json({
                    msg: "No hay imagen para subir (image).",
                });
                return;
            }

            const user = await userService.updateAvatar(
                id,
                req.files.image as fileUpload.UploadedFile
            );

            return res.json({
                user,
            });
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                err: "Ocurrio un error",
            });
        }
    }
}
