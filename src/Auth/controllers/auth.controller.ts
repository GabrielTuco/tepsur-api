import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { SecretaryService } from "../../Secretary/services/secretary.service";
import { generateJWT } from "../../helpers/generateJWT";
import { verifyPassword } from "../../helpers/verifyPassword";
import { FindUserTypesDictionary } from "../interfaces/auth";
import { TeacherService } from "../../Teacher/services/teacher.service";
import { encryptPassword } from "../../helpers/encryptPassword";
import { AdministratorService } from "../../services/admin.service";

const authService = new AuthService();
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
            const { usuario, password, codRol } = req.body;

            //Busqueda del usuario
            const userRegistered = await userService.findByUser(usuario);
            if (!userRegistered) {
                return res.status(400).json({
                    msg: "El usuario no existe",
                });
            }
            if (userRegistered.rol.id !== codRol) {
                return res.status(400).json({
                    msg: "El rol proporcionado para el usuario no es el correcto",
                });
            }

            const userTypes: FindUserTypesDictionary = {
                Secretaria: secretaryService.searchByUser(userRegistered!),
                Docente: teacherService.searchByUser(userRegistered!),
                Administrador: administratorService.searchByUser(
                    userRegistered!
                ),
                Alumno: secretaryService.searchByUser(userRegistered!),
            };

            const userTypeRegistered = await userTypes[
                userRegistered.rol.nombre as keyof FindUserTypesDictionary
            ];

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
            const { codUser, newPassword } = req.body;

            const user = await userService.findById(codUser);
            if (!user) {
                return res.status(400).json({
                    msg: "El usuario no existe",
                });
            }

            const newPasswordUser = encryptPassword(newPassword);
            user.password = newPasswordUser;
            user.securePasswordUpdated = true;
            const saved = await user.save();
            return res.json({
                usuario: saved,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
}
