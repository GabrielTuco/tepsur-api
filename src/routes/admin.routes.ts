import { Router } from "express";
import { AdministratorController } from "../controllers/admin.controller";
import { body, param } from "express-validator";
import { validateFields } from "../middlewares/validateFields";
import { validateJWT } from "../middlewares/validateJWT";
import { checkAuthRole } from "../middlewares/checkAuthRole";
import { ROLES } from "../interfaces/enums";
import { AdministratorService } from "../services/admin.service";

const router = Router();
const adminService = new AdministratorService();
const adminController = new AdministratorController(adminService);

/**
 * @swagger
 * components:
 *  schemas:
 *      Administrator:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *                  description : El uuid del administrador
 *              dni:
 *                  type: string
 *                  description: Dni del administrador
 *              nombres:
 *                  type: string
 *                  description: Primero y/o segundo nombre
 *              apePaterno:
 *                  type: string
 *                  description: Apellido paterno
 *              apeMaterno:
 *                  type: string
 *                  description: Apellido materno
 *              celular:
 *                  type: string
 *                  description: Celular
 *                  example: 987534565
 *              correo:
 *                  type: string
 *                  format: email
 *                  description: Correo
 *              sedeUuid:
 *                  type: string
 *                  format: uuid
 *              usuario:
 *                  type: string
 *              password:
 *                  type: string
 *                  description: El password del administrador de minimo 8 caracteres
 *          required:
 *              - dni
 *              - nombres
 *              - apePaterno
 *              - apeMaterno
 *              - celular
 *              - sedeUuid
 *              - usuario
 *              - password
 */

/**
 * @swagger
 * tags:
 *  name: Administrator
 *  description: Endpoints para el administrador
 */

/**
 * @swagger
 * /admin:
 *  post:
 *      summary: Crea una nuevo administrador con su respectivo usuario por defecto
 *      tags: [Administrator]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Administrator'
 *      responses:
 *          200:
 *              description: El administrador con su nuevo usuario creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Administrator'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT]),
        body("dni").isLength({ min: 8, max: 8 }),
        body("nombres").isString(),
        body("apePaterno").isString(),
        body("apeMaterno").isString(),
        body("sedeUuid").isUUID(4),
        body("usuario").isString(),
        body("password").isString().isLength({ min: 8 }),
        validateFields,
    ],
    adminController.postAdmin
);

/**
 * @swagger
 * /admin/{uuid}:
 *  put:
 *      summary: Actualizar la info de un administrador
 *      tags: [Administrator]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           required: true
 *           schema:
 *              type: string
 *              format: uuid
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Administrator'
 *      responses:
 *          200:
 *              description: El administrador actualizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Administrator'
 *          500:
 *              description: Error de servidor
 *
 */
router.put(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT]),
        param("uuid").isUUID(4),
        body("dni").isLength({ min: 8, max: 8 }),
        body("nombres").isString(),
        body("apePaterno").isString(),
        body("apeMaterno").isString(),
        body("celular").isLength({ min: 9, max: 9 }),
        body("correo").isEmail(),
        validateFields,
    ],
    adminController.putAdmin
);

/**
 * @swagger
 * /admin:
 *  get:
 *      summary: Listado de administradores registrados en el sistema
 *      tags: [Administrator]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: Listado de administradores
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/Administrator'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN])],
    adminController.getAll
);

/**
 * @swagger
 * /admin/{uuid}:
 *  get:
 *      summary: Busqueda de un administrador por uuid
 *      tags: [Administrator]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           required: true
 *           schema:
 *              type: string
 *              format: uuid
 *      responses:
 *          200:
 *              description: El administrador con su nuevo usuario creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Administrator'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN]),
        param("uuid").isUUID(4),
    ],
    adminController.getByUuid
);

/**
 * @swagger
 * /admin/{uuid}:
 *  delete:
 *      summary: Eliminacion de un administrador
 *      tags: [Administrator]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           required: true
 *           schema:
 *              type: string
 *              format: uuid
 *      responses:
 *          200:
 *              description: El administrador eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Administrator'
 *          500:
 *              description: Error de servidor
 *
 */
router.delete(
    "/:uuid",
    [validateJWT, checkAuthRole([ROLES.ROOT]), param("uuid").isUUID(4)],
    adminController.deleteAdmin
);

export default router;
