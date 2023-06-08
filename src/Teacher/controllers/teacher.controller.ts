import { Request, Response } from "express";
import { TeacherService } from "../services/teacher.service";
import { encryptPassword } from "../../helpers/encryptPassword";

const teacherService = new TeacherService();

export class TeacherController {
    async postRegister(req: Request, res: Response) {
        try {
            const { dni, nombres, apePaterno, apeMaterno, codSede } = req.body;
            const newTeacher = await teacherService.register({
                apeMaterno,
                apePaterno,
                dni,
                nombres,
                sedeUuid: codSede,
            });
            if (!newTeacher) {
                return res.status(400).json({
                    msg: "No se pudo crear el registro",
                });
            }
            const newTeacherUser = await teacherService.createUser(
                newTeacher.dni,
                encryptPassword(newTeacher.dni),
                3,
                newTeacher.uuid
            );

            return res.json(newTeacherUser);
        } catch (error) {}
    }
    async getList(_req: Request, res: Response) {
        try {
            const teachers = await teacherService.listAll();
            return res.json(teachers);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
    async getOne(_req: Request, _res: Response) {}
}
