import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { generateJWT } from "../../helpers/generateJWT";
import { verifyPassword } from "../../helpers/verifyPassword";
import { encryptPassword } from "../../helpers/encryptPassword";
import { FindUserTypesDictionary } from "../interfaces/auth";
import { SecretaryService } from "../../Secretary/services/secretary.service";
import { TeacherService } from "../../Teacher/services/teacher.service";
import { AdministratorService } from "../../services/admin.service";

const userService = new UserService();
const secretaryService = new SecretaryService();
const teacherService = new TeacherService();
const administratorService = new AdministratorService();

declare module "express-serve-static-core" {
    interface Request {
        id: number;
        user: string;
    }
}
export class AuthController {
    async postLogin(req: Request, res: Response) {
        //TODO: Validar la sede a la que pertenece el usuario

        try {
            const { usuario, password } = req.body;

            //Busqueda del usuario
            const userRegistered = await userService.findByUser(usuario);
            if (!userRegistered) {
                return res.status(400).json({
                    msg: "El usuario no existe",
                });
            }

            const userTypes: FindUserTypesDictionary = {
                Docente: teacherService.searchByUser,
                Secretaria: secretaryService.searchByUser,
                Administrador: administratorService.searchByUser,
                Alumno: administratorService.searchByUser,
            };

            const role = userRegistered.rol.nombre;

            const userTypeRegistered = await userTypes[
                role as keyof FindUserTypesDictionary
            ](userRegistered!);

            if (!userTypeRegistered) {
                return res.status(400).json({
                    msg: "La persona no existe",
                });
            }
            const passwordValid = verifyPassword(
                password,
                userRegistered.password
            );
            if (!passwordValid) {
                return res.status(400).json({
                    msg: "Password incorrecto",
                });
            }

            res.json({
                userRegistered: userTypeRegistered,
                token: await generateJWT(
                    userRegistered.id,
                    userRegistered.usuario
                ),
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }

    async revalidateToken(req: Request, res: Response) {
        try {
            const { id, user } = req;

            const token = await generateJWT(id, user);

            return res.json({
                token,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }

    async changePassword(req: Request, res: Response) {
        try {
            const { codUser, currentPassword, newPassword } = req.body;

            const user = await userService.findById(codUser);
            if (!user) {
                return res.status(404).json({
                    msg: "El usuario no existe",
                });
            }
            const currentPasswordIsValid = verifyPassword(
                currentPassword,
                user.password
            );
            if (!currentPasswordIsValid) {
                return res.status(404).json({
                    msg: "La contraseña actual no es correcta",
                });
            }

            const newPasswordUser = encryptPassword(newPassword);
            user.password = newPasswordUser;
            user.securePasswordUpdated = true;
            const saved = await user.save();
            return res.json(saved);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
}
