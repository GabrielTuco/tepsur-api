import { Request, Response } from "express";
import { StudentService } from "../services/student.service";
import { studentAdapter } from "../adapters/student.adapter";

const studentService = new StudentService();

export class StudentController {
    public async patchUpdateStudent(req: Request, res: Response) {
        try {
            const student = await studentService.updateInfo(
                req.params.id,
                studentAdapter(req.body)
            );

            return res.json(student);
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}
