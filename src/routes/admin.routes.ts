import { Router } from "express";
import { AdministratorController } from "../controllers/admin.controller";
import { body } from "express-validator";
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
 *          required:
 *              - dni
 *              - nombres
 *              - apePaterno
 *              - apeMaterno
 *              - celular
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
        validateFields,
    ],
    adminController.postAdministrator
);

export default router;
