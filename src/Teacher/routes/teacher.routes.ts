import { Router } from "express";
import { body } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { hasPermissionRole } from "../../middlewares/hasPermissionRole";
import { TeacherController } from "../controllers/teacher.controller";

const router = Router();
const teacherController = new TeacherController();

router.post(
    "/",
    [
        body("dni", "El campo debe contener un numero de dni valido").isLength({
            min: 8,
            max: 8,
        }),
        body("nombres", "El campo es obligatorio").isString(),
        body("apePaterno", "El campo es obligatorio").isString(),
        body("apeMaterno", "El campo es obligatorio").isString(),
        body("codSede", "El campo es obligatorio").isNumeric(),
        body("userCodRol", "El campo es obligatorio").custom((value) =>
            hasPermissionRole(value, "Administrador")
        ),
        validateFields,
    ],
    teacherController.postRegister
);
router.get("/", [], teacherController.getList);
router.get("/:id", [], teacherController.getOne);

export default router;
