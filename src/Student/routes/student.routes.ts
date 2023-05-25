import { Router } from "express";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { StudentService } from "../services/student.service";
import { StudentController } from "../controllers/student.controller";

const router = Router();
const studentService = new StudentController();

router.patch(
    "/update-info/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ALUMNO]),
        param("id").isUUID("4"),
        validateFields,
    ],
    studentService.patchUpdateStudent
);

export default router;
