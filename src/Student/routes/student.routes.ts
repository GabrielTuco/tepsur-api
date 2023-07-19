import { Router } from "express";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { param, query } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { StudentService } from "../services/student.service";
import { StudentController } from "../controllers/student.controller";

const router = Router();

const studentService = new StudentService();
const studentController = new StudentController(studentService);

/**
 * @swagger
 * components:
 *  schemas:
 *      Alumno:
 *          properties:
 *              id:
 *                  type: number
 *                  description : El id autogenerado de la secretaria
 *              dni:
 *                  type: string
 *                  description: Dni de la secretaria
 *              nombres:
 *                  type: string
 *                  description: Primero y/o segundo nombre
 *              apePaterno:
 *                  type: string
 *                  description: Apellido paterno
 *              apeMaterno:
 *                  type: string
 *                  description: Apellido materno
 *              sexo:
 *                  type: string
 *                  description: Sexo
 *              edad:
 *                  type: number
 *                  description: Edad del alumno
 *              gradoEstudiosUuid:
 *                  type: number
 *                  description: Grado de estudios del almuno
 *              lugarResidencia:
 *                  type: string
 *                  description: Lugar de nacimiento
 *              celular:
 *                  type: string
 *                  description: Celular
 *              celularReferencia:
 *                  type: string
 *                  description: Celular de referencia
 *              correo:
 *                  type: string
 *                  description: Correo
 *              direccion:
 *                  type: object
 *                  $ref: '#/components/schemas/Direccion'
 *                  description: El codigo de la sede en la que se registra la secretaria
 *          required:
 *              - dni
 *              - nombre
 *              - apePaterno
 *              - apeMaterno
 *              - sexo
 *              - edad
 *              - gradoEstudiosUuid
 *              - lugarNacimiento
 *              - celular
 *              - correo
 *              - direccion
 */

/**
 * @swagger
 * tags:
 *  name: Student
 *  description: Endpoints para los alumnos
 */

/**
 * @swagger
 * /student:
 *  get:
 *      summary: Listado general de alumnos por sede
 *      tags: [Student]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: query
 *            name: sede
 *            schema:
 *              type: string
 *              format: uuid
 *            required: true
 *            description: El uuid de la sede
 *      responses:
 *          200:
 *              description: El listado de alumnos
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/Alumno'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        query("sede").isUUID("4"),
        validateFields,
    ],
    studentController.getListBySede
);

router.patch(
    "/update-info/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ALUMNO]),
        param("id").isUUID("4"),
        validateFields,
    ],
    studentController.patchUpdateStudent
);

export default router;
