import { Router } from "express";
import { body } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { hasPermissionRole } from "../../middlewares/hasPermissionRole";
import { TeacherController } from "../controllers/teacher.controller";

const router = Router();
const teacherController = new TeacherController();
/**
 * @swagger
 * components:
 *  schemas:
 *      Teacher:
 *          properties:
 *              id:
 *                  type: number
 *                  description: El id autogenerado del profesor
 *              dni:
 *                  type: string
 *                  description: Dni del docente
 *              nombres:
 *                  type: string
 *                  description: Nombres del docente
 *              apePaterno:
 *                  type: string
 *                  description: Apellido paterno del docente
 *              apeMaterno:
 *                  type: string
 *                  description: Apellido materno del docente
 *              codSede:
 *                  type: number
 *                  description: El codigo de la sede donde se registra el docente
 *          required:
 *              - dni
 *              - nombres
 *              - apePaterno
 *              - apeMaterno
 *              - codSede
 */

/**
 * @swagger
 * tags:
 *  name: Teacher
 *  description: Endpoints para Docente
 */

/**
 * @swagger
 * /teacher:
 *  post:
 *      summary: Crea un nuevo docente con su respectivo usuario por defecto
 *      tags: [Teacher]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Teacher'
 *      responses:
 *          200:
 *              description: La secretaria con su nuevo usuario creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          description: El docente registrado
 *          500:
 *              description: Error de servidor
 *
 */
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

/**
 * @swagger
 * /teacher:
 *  get:
 *      summary: Listado de docentes
 *      tags: [Teacher]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: Listado de docentes registrados en el sistema
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          description: Listado
 *          500:
 *              description: Error de servidor
 *
 */
router.get("/", [], teacherController.getList);
router.get("/:id", [], teacherController.getOne);

export default router;
