import { Router } from "express";
import { EspecializacionService } from "../services/especializacion.service";
import { EspecializacionController } from "../controllers/especializacion.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();
const especializacionService = new EspecializacionService();
const especializacionController = new EspecializacionController(
    especializacionService
);

/**
 * @swagger
 * components:
 *  schemas:
 *      Especializacion:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *                  description: El uuid  de la especializacion
 *              nombre:
 *                  type: string
 *                  description: El nombre de la especializacion
 *              duracionSemanas:
 *                  type: number
 *                  descripcion: La duracion en semanas de la especializacion
 *              precio:
 *                  type: number
 *                  description: La tarifa/precio de la especializacion
 *          required:
 *              - nombre
 *              - duracionSemanas
 *              - precio
 *  parameters:
 *      uuid:
 *          in: path
 *          name: uuid
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *              description: El uuid de la especializacion
 */

/**
 * @swagger
 * tags:
 *  name: Especializacion
 *  description: Endpoints para las especializaciones
 */

/**
 * @swagger
 * /especializacion:
 *  get:
 *      summary: Listado de especializaciones
 *      tags: [Especializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: El listado de especializaciones
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          $ref: '#/components/schemas/Especializacion'
 *          401:
 *              description: Token de autenticacion faltante
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: El error de autenticacion
 *                                  example: "Se debe enviar el token de autenticacion"
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    especializacionController.getList
);

/**
 * @swagger
 * /especializacion/list-by-sede/{uuid}:
 *  get:
 *      summary: Listado de especializaciones
 *      tags: [Especializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format: uuid
 *            description: El uuid de la sede
 *      responses:
 *          200:
 *              description: El listado de especializaciones
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          $ref: '#/components/schemas/Especializacion'
 *          401:
 *              description: Token de autenticacion faltante
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: El error de autenticacion
 *                                  example: "Se debe enviar el token de autenticacion"
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/list-by-sede/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
        validateFields,
    ],
    especializacionController.getListBySede
);

/**
 * @swagger
 * /especializacion/{uuid}:
 *  get:
 *      summary: Busqueda de una especializacion por uuid
 *      tags: [Especializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - $ref: '#/components/parameters/uuid'
 *      responses:
 *          200:
 *              description: Retorna la especializacion encontrada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Especializacion'
 *          401:
 *              description: Token de autenticacion faltante
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: El error de autenticacion
 *                                  example: "Se debe enviar el token de autenticacion"
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    especializacionController.getOneByUuid
);

/**
 * @swagger
 * /especializacion:
 *  post:
 *      summary: Registrar una especializacion
 *      tags: [Especializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Especializacion'
 *      responses:
 *          200:
 *              description: Retorna la especializacion registrada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          $ref: '#/components/schemas/Especializacion'
 *          401:
 *              description: Token de autenticacion faltante
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: El error de autenticacion
 *                                  example: "Se debe enviar el token de autenticacion"
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        body("nombre").isString(),
        body("duracionSemanas").isNumeric(),
        body("precio").isNumeric(),
        validateFields,
    ],
    especializacionController.postEspecializacion
);

/**
 * @swagger
 * /especializacion/{uuid}:
 *  put:
 *      summary: Actualiza una especializacion
 *      tags: [Especializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - $ref: '#/components/parameters/uuid'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                          duracionSemanas:
 *                              type: number
 *                          precio:
 *                              type: number
 *      responses:
 *          200:
 *              description: Retorna la especializacion actualizada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          $ref: '#/components/schemas/Especializacion'
 *          401:
 *              description: Token de autenticacion faltante
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: El error de autenticacion
 *                                  example: "Se debe enviar el token de autenticacion"
 *          500:
 *              description: Error de servidor
 *
 */
router.put(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        body("nombre").optional().isString(),
        body("duracionSemanas").optional().isNumeric(),
        body("precio").optional().isNumeric(),
        validateFields,
    ],
    especializacionController.putEspecializacion
);

/**
 * @swagger
 * /especializacion/{uuid}:
 *  delete:
 *      summary: Elimina una especializacion(eliminacion logica)
 *      tags: [Especializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - $ref: '#/components/parameters/uuid'
 *      responses:
 *          200:
 *              description: Retorna la especializacion "eliminada"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Especializacion'
 *          401:
 *              description: Token de autenticacion faltante
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: El error de autenticacion
 *          500:
 *              description: Error de servidor
 *
 */
router.delete(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    especializacionController.deleteEspecializacion
);

export default router;
