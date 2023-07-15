import { Request, Response } from "express";
import { StudentService } from "../services/student.service";
import { studentAdapter } from "../adapters/student.adapter";

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  public patchUpdateStudent = async (req: Request, res: Response) => {
    try {
      const student = await this.studentService.updateInfo(
        req.params.id,
        studentAdapter(req.body)
      );

      return res.json(student);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
  public getListBySede = async (req: Request, res: Response) => {
    try {
      const { sede } = req.query;

      const alumnos = await this.studentService.listBySede(String(sede));

      return res.json(alumnos);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
}
