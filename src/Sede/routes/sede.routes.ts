import { Router } from "express";
import { SedeController } from "../controllers/sede.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { SedeService } from "../services/sede.service";
import { param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();

const sedeService = new SedeService();
const sedeController = new SedeController(sedeService);

/**
 * @swagger
 * components:
 *  schemas:
 *      Sede:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *                  description: El uuid  de la sede
 *              nombre:
 *                  type: string
 *                  description: El nombre de la sede
 *              direccion:
 *                  type: object
 *                  $ref: '#/components/schemas/Direccion'
 *          required:
 *              - nombre
 *              - direccion
 *
 *      Direccion:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *                  description : El uuid  de la direccion
 *              direccionExacta:
 *                  type: string
 *                  description: Direccion exacta de la sede (Calle, Avenida, Numero, ETC)
 *              distrito:
 *                  type: string
 *                  description: Distrito donde se ubica la sede
 *              provincia:
 *                  type: string
 *                  description: Provincia donde se ubica la sede
 *              departamento:
 *                  type: string
 *                  description: Departamento donde se ubica la sede
 *          required:
 *              - direccionExacta
 *              - distrito
 *              - provincia
 *              - departamento
 *  parameters:
 *      codSede:
 *          in: path
 *          name: uuid
 *          required: true
 *          schema:
 *              type: string
 *              format: uuid
 *              description: El uuid de la sede
 */

/**
 * @swagger
 * tags:
 *  name: Sede
 *  description: Endpoints para sedes
 */

/**
 * @swagger
 * /sede:
 *  get:
 *      summary: Listado de sede existentes
 *      tags: [Sede]
 *      responses:
 *          200:
 *              description: El listado de sedes
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          $ref: '#/components/schemas/Sede'
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
router.get(
    "/",
    //[validateJWT, checkAuthRole([ROLES.ADMIN, ROLES.SECRE])],
    sedeController.getAll
);

/**
 * @swagger
 * /sede/{uuid}:
 *  get:
 *      summary: Retorna la sede a buscar
 *      tags: [Sede]
 *      parameters:
 *          - $ref: '#/components/parameters/codSede'
 *      responses:
 *          200:
 *              description: La sede registrada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Sede'
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
router.get(
    "/:id",
    [validateJWT, checkAuthRole([ROLES.ADMIN])],
    sedeController.getOneById
);

/**
 * @swagger
 * /sede:
 *  post:
 *      summary: Crea una nueva sede o local
 *      tags: [Sede]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                              description: Nombre de la nueva sede
 *                          direccion:
 *                              type: object
 *                              $ref: '#/components/schemas/Direccion'
 *      responses:
 *          200:
 *              description: La nueva sede creada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Sede'
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
router.post(
    "/",
    [validateJWT, checkAuthRole([ROLES.ADMIN])],
    sedeController.postSede
);

/**
 * @swagger
 * /sede/{uuid}:
 *  delete:
 *      summary: Eliminar una sede (eliminacion logica)
 *      tags: [Sede]
 *      parameters:
 *          - $ref: '#/components/parameters/codSede'
 *      responses:
 *          200:
 *              description: La sede registrada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Sede'
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
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    sedeController.deleteSede
);
export default router;
