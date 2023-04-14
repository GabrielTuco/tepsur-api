import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { SecretaryService } from "../../Secretary/services/secretary.service";
import { generateJWT } from "../../helpers/generateJWT";
import { verifyPassword } from "../../helpers/verifyPassword";
import { FindUserTypesDictionary } from "../interfaces/auth";
import { TeacherService } from "../../Teacher/services/teacher.service";

const authService = new AuthService();
const userService = new UserService();
const secretaryService = new SecretaryService();
const teacherService = new TeacherService();
export class AuthController {
    async postLogin(req: Request, res: Response) {
        //Validar la sede a la que pertenece el usuario

        try {
            const { usuario, password, codRol } = req.body;

            //Busqueda del usuario
            const userRegistered = await userService.getByUser(usuario);
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
                Administrador: secretaryService.searchByUser(userRegistered!),
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
                userTypeRegistered,
                token: await generateJWT(userRegistered.usuario),
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
}
