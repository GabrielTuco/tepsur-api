import { Router } from "express";
import { TarifaPensionCarreraController } from "../controllers/tarifaPensionCarrera.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();
const tarifaController = new TarifaPensionCarreraController();

/**
 * @swagger
 * components:
 *  schemas:
 *      TarifaPension:
 *          properties:
 *              carreraUuid:
 *                  type: string
 *                  format: uuid
 *              tarifa:
 *                  type: number
 *      TarifaPensionResponse:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *              carrera:
 *                  $ref: '#/components/schemas/Career'
 *              tarifa:
 *                  type: number
 */

/**
 * @swagger
 * tags:
 *  name: TarifaPension
 *  description: Endpoints para las tarifas de pension de cada carrera
 */

/**
 * @swagger
 * /tarifa-pension:
 *  post:
 *      summary: Registrar nueva tarifa
 *      tags: [TarifaPension]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TarifaPension'
 *      responses:
 *          200:
 *              description: La tarifa registrada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TarifaPensionResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        body("carreraUuid").isUUID("4"),
        body("tarifa").isNumeric(),
        validateFields,
    ],
    tarifaController.POSTregister
);

/**
 * @swagger
 * /tarifa-pension:
 *  get:
 *      summary: Listado de tarifas
 *      tags: [TarifaPension]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: El listado de tarifas
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/TarifaPensionResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    tarifaController.GETall
);

/**
 * @swagger
 * /tarifa-pension/list-by-sede/{uuid}:
 *  get:
 *      summary: Listado de tarifas por sede
 *      tags: [TarifaPension]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           required: true
 *           schema:
 *              type: string
 *              format: uuid
 *           description: El uuid de la sede
 *      responses:
 *          200:
 *              description: El listado de tarifas por sede
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/TarifaPensionResponse'
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
    tarifaController.GETallBySede
);

/**
 * @swagger
 * /tarifa-pension/find-by-uuid/{uuid}:
 *  get:
 *      summary: Busqueda de tarifa por uuid
 *      tags: [TarifaPension]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El uuid de la tarifa
 *      responses:
 *          200:
 *              description: La tarifa
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TarifaPensionResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/find-by-uuid/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    tarifaController.GEToneByUuid
);

/**
 * @swagger
 * /tarifa-pension/find-by-carrera-uuid/{uuid}:
 *  get:
 *      summary: Busqueda de tarifa por uuid de la carrera
 *      tags: [TarifaPension]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El uuid de la carrera
 *      responses:
 *          200:
 *              description: La tarifa
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TarifaPensionResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/find-by-carrera-uuid/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    tarifaController.GEToneByCarreraUuid
);

/**
 * @swagger
 * /tarifa-pension/{uuid}:
 *  put:
 *      summary: Actualizar un tarifa
 *      tags: [TarifaPension]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El uuid de la tarifa
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          tarifa:
 *                              type: number
 *      responses:
 *          200:
 *              description: La tarifa actualizada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TarifaPensionResponse'
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
        validateFields,
    ],
    tarifaController.PUTupdate
);

/**
 * @swagger
 * /tarifa-pension/{uuid}:
 *  delete:
 *      summary: Eliminar un tarifa
 *      tags: [TarifaPension]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El uuid de la tarifa
 *      responses:
 *          200:
 *              description: La tarifa eliminada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/TarifaPensionResponse'
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
    tarifaController.DELETEdelete
);

export default router;
