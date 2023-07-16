import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { hasPermissionRole } from "../../middlewares/hasPermissionRole";
import { TeacherController } from "../controllers/teacher.controller";
import { ROLES } from "../../interfaces/enums";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { TeacherService } from "../services/teacher.service";

const router = Router();
const teacherService = new TeacherService();
const teacherController = new TeacherController(teacherService);
/**
 * @swagger
 * components:
 *  schemas:
 *      Teacher:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *                  description: El uuid  del profesor
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
 *      parameters:
 *         - $ref: '#/components/parameters/token'
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
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    body("dni", "El campo debe contener un numero de dni valido").isLength({
      min: 8,
      max: 8,
    }),
    body("nombres", "El campo es obligatorio").isString(),
    body("apePaterno", "El campo es obligatorio").isString(),
    body("apeMaterno", "El campo es obligatorio").isString(),
    body("codSede", "El campo es obligatorio").isUUID("4"),
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
router.get(
  "/",
  [validateJWT, checkAuthRole([ROLES.ADMIN, ROLES.SECRE])],
  teacherController.getList
);

/**
 * @swagger
 * /teacher/find-by-sede:
 *  get:
 *      summary: Listado de docentes de una determinada sede
 *      tags: [Teacher]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: query
 *            name: sede
 *            schema:
 *              type: string
 *              format: uuid
 *            description: El uuid de la sede
 *      responses:
 *          200:
 *              description: Retorna la lista de docentes de la sede
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          description: Listado
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
  "/find-by-sede",
  [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    query("sede").isUUID("4"),
    validateFields,
  ],
  teacherController.getListBySede
);

/**
 * @swagger
 * /teacher/{uuid}:
 *  patch:
 *      summary: Actualizar la informacion personal de un docente
 *      tags: [Teacher]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            schema:
 *              type: string
 *              format: uuid
 *            description: El uuid del docente
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombres:
 *                              type: string
 *                          apePaterno:
 *                              type: string
 *                          apeMaterno:
 *                              type: string
 *      responses:
 *          200:
 *              description: Retorna el docente actualizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          description: Docente
 *          500:
 *              description: Error de servidor
 *
 */
router.patch(
  "/:uuid",
  [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    param("uuid", "Debe ser un uuid valido").isUUID("4"),
    body("nombres").optional().isString(),
    body("apePaterno").optional().isString(),
    body("apeMaterno").optional().isString(),
    validateFields,
  ],
  teacherController.updateTeacher
);

/**
 * @swagger
 * /teacher/{uuid}:
 *  delete:
 *      summary: Eliminar un docente
 *      tags: [Teacher]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            schema:
 *              type: string
 *              format: uuid
 *            description: El uuid del docente
 *      responses:
 *          200:
 *              description: Retorna el docente eliminado (eliminacion logica)
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          description: Docente
 *          500:
 *              description: Error de servidor
 *
 */
router.delete(
  "/:uuid",
  [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    param("uuid").isUUID("4"),
    validateFields,
  ],
  teacherController.deleteTeacher
);

export default router;
