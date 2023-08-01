import { Router } from "express";
import { SecretaryController } from "../controllers/secretary.controller";
import { body, param, query } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { ROLES } from "../../interfaces/enums";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { SecretaryService } from "../services/secretary.service";

const router = Router();
const secretaryService = new SecretaryService();
const secretaryController = new SecretaryController(secretaryService);

/**
 * @swagger
 * components:
 *  schemas:
 *      Secretary:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *                  description : El id de la secretaria
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
 *              celular:
 *                  type: string
 *                  description: Celular
 *              correo:
 *                  type: string
 *                  description: Correo
 *              codSede:
 *                  type: string
 *                  format: uuid
 *                  description: El uuid de la sede en la que se registra la secretaria
 *          required:
 *              - dni
 *              - nombre
 *              - apePaterno
 *              - apeMaterno
 *              - codSede
 */

/**
 * @swagger
 * tags:
 *  name: Secretary
 *  description: Endpoints para la secretaria
 */

/**
 * @swagger
 * /secretary:
 *  post:
 *      summary: Crea una nueva secretaria con su respectivo usuario por defecto
 *      tags: [Secretary]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Secretary'
 *      responses:
 *          200:
 *              description: La secretaria con su nuevo usuario creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Secretary'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN]),
        body("dni", "Debe de contener 8 caracteres").isLength({
            min: 8,
            max: 8,
        }),
        body("nombres", "Este campo es obligatorio").isString(),
        body("apePaterno", "Este campo es obligatorio").isString(),
        body("apeMaterno", "Este campo es obligatorio").isString(),
        body("codSede", "Este campo es obligatorio").isUUID("4"),
        validateFields,
    ],
    secretaryController.postSecretary
);

/**
 * @swagger
 * /secretary:
 *  get:
 *      summary: Listado de secretarias registradas
 *      tags: [Secretary]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: Retorna el listado general de secretarias registradas
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/Secretary'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    secretaryController.getSecretaries
);

/**
 * @swagger
 * /secretary/list-by-sede:
 *  get:
 *      summary: Listado de secretarias registradas dada una sede
 *      tags: [Secretary]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: query
 *           name: sede
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El uuid de la sede
 *      responses:
 *          200:
 *              description: Retorna el listado de secretarias de una determinada sede
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/Secretary'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/list-by-sede",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        query("sede", "Debe ser un uuuid valido").isUUID("4"),
        validateFields,
    ],
    secretaryController.getSecretariesBySede
);

/**
 * @swagger
 * /secretary/{uuid}:
 *  patch:
 *      summary: Actualiza la informacion personal de una secretaria
 *      tags: [Secretary]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El uuid de la secretaria
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Secretary'
 *      responses:
 *          200:
 *              description: Retorna la secretaria con sus datos actualizados
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Secretary'
 *          500:
 *              description: Error de servidor
 *
 */
router.patch(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    secretaryController.patchSecretary
);

/**
 * @swagger
 * /secretary/{uuid}:
 *  delete:
 *      summary: Elimina una secretaria(eliminacion logica)
 *      tags: [Secretary]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El uuid de la secretaria
 *      responses:
 *          200:
 *              description: Retorna la secretaria eliminada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Secretary'
 *          500:
 *              description: Error de servidor
 *
 */
router.delete(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    secretaryController.deleteSecretary
);

export default router;
