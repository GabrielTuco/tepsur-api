import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { generateJWT } from "../../helpers/generateJWT";
import { verifyPassword } from "../../helpers/verifyPassword";
import { encryptPassword } from "../../helpers/encryptPassword";
import { FindUserTypesDictionary } from "../interfaces/auth";
import { SecretaryService } from "../../Secretary/services/secretary.service";
import { TeacherService } from "../../Teacher/services/teacher.service";
import { AdministratorService } from "../../Administrator/service/admin.service";
import { StudentService } from "../../Student/services/student.service";
import { ROLES } from "../../interfaces/enums";
import { DatabaseError } from "../../errors/DatabaseError";
import { PensionService } from "../../Pension/services/pension.service";

const userService = new UserService();
const secretaryService = new SecretaryService();
const teacherService = new TeacherService();
const administratorService = new AdministratorService();
const pensionService = new PensionService();
const alumnoService = new StudentService(pensionService);

declare module "express-serve-static-core" {
    interface Request {
        id: string;
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
                return res.status(404).json({
                    msg: "El usuario no existe",
                });
            }

            //Validacion de usuario ROOT
            if (userRegistered.rol.nombre === ROLES.ROOT) {
                if (userRegistered.password !== password) {
                    return res.status(400).json({
                        msg: "Password incorrecto",
                    });
                }
                return res.json({
                    userRegistered: {
                        id: userRegistered.uuid,
                        usuario: userRegistered.usuario,
                        avatar: userRegistered.avatar,
                        rol: userRegistered.rol,
                    },
                    token: await generateJWT(
                        userRegistered.uuid,
                        userRegistered.usuario
                    ),
                });
            }

            const userTypes: FindUserTypesDictionary = {
                Docente: teacherService.searchByUser,
                Secretaria: secretaryService.searchByUser,
                Administrador: administratorService.searchByUser,
                Alumno: alumnoService.searchByUser,
            };

            const role = userRegistered.rol.nombre;

            const userTypeRegistered = await userTypes[
                role as keyof FindUserTypesDictionary
            ](userRegistered!);

            //   if (!userTypeRegistered) {
            //     return res.status(404).json({
            //       msg: "La persona no existe o se ha eliminado de la base de datos ;)",
            //     });
            //   }

            const passwordValid = verifyPassword(
                password,
                userRegistered.password
            );
            if (!passwordValid) {
                return res.status(404).json({
                    msg: "Password incorrecto",
                });
            }

            res.json({
                userRegistered: userTypeRegistered,
                token: await generateJWT(
                    userRegistered.uuid,
                    userRegistered.usuario
                ),
            });
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            res.status(500).json({
                msg: "Internal server error, contact the administrator",
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
