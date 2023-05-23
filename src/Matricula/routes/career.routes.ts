import { Router } from "express";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { CareerController } from "../controllers/career.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { ROLES } from "../../interfaces/enums";
import { checkAuthRole } from "../../middlewares/checkAuthRole";

const router = Router();
const careerController = new CareerController();
/**
 * @swagger
 * components:
 *  schemas:
 *      Career:
 *          properties:
 *              numModulos:
 *                  type: number
 *                  description: El numero de modulos con los que cuenta la carrera
 *              nombre:
 *                  type: string
 *              modalidad:
 *                  type: string
 *              modulos:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                          duracion_semanas:
 *                              type: string
 *
 *      CareerResponse:
 *          properties:
 *              id:
 *                  type: number
 *                  description : El id autogenerado de la secretaria
 *              uuid:
 *                  type: string
 *                  format: uuid
 *              num_modulos:
 *                  type: number
 *                  description: Numero de modulos
 *              nombre:
 *                  type: string
 *                  description: Nombre de la carrera
 *              modalidad:
 *                  type: string
 *                  description: Modalida de la carrera
 */

/**
 * @swagger
 * tags:
 *  name: Career
 *  description: Endpoints para las carreras
 */

/**
 * @swagger
 * /career:
 *  get:
 *      summary: Listado de carreras
 *      tags: [Career]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: La secretaria con su nuevo usuario creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/CareerResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ADMIN, ROLES.SECRE])],
    careerController.getCareers
);

/**
 * @swagger
 * /career/find-by-uuid/{uuid}:
 *  get:
 *      summary: Busca una carrera por uuid
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            schema:
 *                  type: string
 *                  format: uuid
 *            required: true
 *            description: El uuid de la carrera
 *      responses:
 *          200:
 *              description: La informacion de la carrera
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/CareerResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/find-by-uuid/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").exists(),
        validateFields,
    ],
    careerController.getCareerByUuid
);

/**
 * @swagger
 * /career/find-by-name/{name}:
 *  get:
 *      summary: Busca una carrera por nombre
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: name
 *            schema:
 *                 type: string
 *            required: true
 *            description: El nombre de la carrera
 *      responses:
 *          200:
 *              description: La informacion de la carrera
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/CareerResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/find-by-name/:name",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("name").exists(),
        validateFields,
    ],
    careerController.getCareerByName
);

/**
 * @swagger
 * /career/modules/{uuid}:
 *  get:
 *      summary: Obtener los modulos de una carrera
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            schema:
 *                  type: string
 *                  format: uuid
 *            required: true
 *            description: El uuid de la carrera
 *      responses:
 *          200:
 *              description: La informacion de los modulos de la carrera
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  id:
 *                                      type: number
 *                                  uuid:
 *                                      type: string
 *                                      format: uuid
 *                                  nombre:
 *                                      type: string
 *                                  duracion_semanas:
 *                                      type: string
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/modules/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").exists(),
        validateFields,
    ],
    careerController.getModulesOfCareer
);

/**
 * @swagger
 * /career:
 *  post:
 *      summary: Crea una nueva carrera
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Career'
 *      responses:
 *          200:
 *              description: La nueva carrera creada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/CareerResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
        body("nombre").isString(),
        body("numModulos").isNumeric(),
        body("modulos").isArray(),
        body("modalidad").isString(),
        validateFields,
    ],
    careerController.postCareer
);

export default router;
