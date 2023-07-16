import { Request, Response } from "express";
import { TeacherService } from "../services/teacher.service";
import { encryptPassword } from "../../helpers/encryptPassword";
import { DatabaseError } from "../../errors/DatabaseError";

export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}
  public postRegister = async (req: Request, res: Response) => {
    try {
      const { dni, nombres, apePaterno, apeMaterno, codSede } = req.body;
      const teacher = await this.teacherService.register({
        apeMaterno,
        apePaterno,
        dni,
        nombres,
        sedeUuid: codSede,
      });

      return res.json(teacher);
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        return res.status(error.codeStatus).json({
          msg: error.message,
          name: error.name,
        });
      }
      return res.status(500).json({
        msg: "Internal server error, contact the administrator",
      });
    }
  };

  public getList = async (_req: Request, res: Response) => {
    try {
      const teachers = await this.teacherService.listAll();
      return res.json(teachers);
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        return res.status(error.codeStatus).json({
          msg: error.message,
          name: error.name,
        });
      }
      return res.status(500).json({
        msg: "Internal server error, contact the administrator",
      });
    }
  };

  public getListBySede = async (req: Request, res: Response) => {
    try {
      const { sede } = req.query;
      const docente = await this.teacherService.listBySede(String(sede));

      return res.json(docente);
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        return res.status(error.codeStatus).json({
          msg: error.message,
          name: error.name,
        });
      }
      return res.status(500).json({
        msg: "Internal server error, contact the administrator",
      });
    }
  };

  public getByUuid = async (req: Request, res: Response) => {
    try {
      const { uuid } = req.params;
      const docente = await this.teacherService.searchByUuid(uuid);
      return res.json(docente);
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        return res.status(error.codeStatus).json({
          msg: error.message,
          name: error.name,
        });
      }
      return res.status(500).json({
        msg: "Internal server error, contact the administrator",
      });
    }
  };

  public updateTeacher = async (req: Request, res: Response) => {
    try {
      const { nombres, apePaterno, apeMaterno } = req.body;
      const { uuid } = req.params;
      const teacher = await this.teacherService.update({
        uuid,
        nombres,
        apePaterno,
        apeMaterno,
      });

      return res.json(teacher);
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        return res.status(error.codeStatus).json({
          msg: error.message,
          name: error.name,
        });
      }
      return res.status(500).json({
        msg: "Internal server error, contact the administrator",
      });
    }
  };

  public deleteTeacher = async (req: Request, res: Response) => {
    try {
      const { uuid } = req.params;
      const teacher = await this.teacherService.delete(uuid);

      return res.json(teacher);
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        return res.status(error.codeStatus).json({
          msg: error.message,
          name: error.name,
        });
      }
      return res.status(500).json({
        msg: "Internal server error, contact the administrator",
      });
    }
  };
}
