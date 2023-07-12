import { Router } from "express";
import { body, param, query } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { CareerController } from "../controllers/career.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { ROLES, TIPO_CARRERA } from "../../interfaces/enums";
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
 *              duracionMeses:
 *                  type: number
 *                  description: La duracion de la carrera en meses
 *              tipoCarrera:
 *                  type: string
 *                  enum: [modular,semestral]
 *                  example: "modular"
 *              sedeUuid:
 *                  type: string
 *                  format: uuid
 *                  description: Sede en donde se registra la carrera
 *              modulos:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                          duracionSemanas:
 *                              type: string
 *                              example: '4 semanas'
 *                          orden:
 *                              type: number
 *                              description: El orden en el que se lleva el modulo
 *          required:
 *              - numModulos
 *              - nombre
 *              - duracionMeses
 *              - tipoCarrera
 *
 *      CareerResponse:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *                  description: El uuid de la carrera
 *              num_modulos:
 *                  type: number
 *                  description: Numero de modulos
 *              nombre:
 *                  type: string
 *                  description: Nombre de la carrera
 *              modalidad:
 *                  type: string
 *                  description: Modalida de la carrera
 *              modulos:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                          duracionSemanas:
 *                              type: string
 *                              example: "4 semanas"
 *                          orden:
 *                              type: number
 *                              example: 1
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
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        body("nombre").isString(),
        body("numModulos").isNumeric(),
        body("modulos").isArray(),
        body("modulos.*.nombre").isString(),
        body("modulos.*.duracionSemanas").isString(),
        body("modulos.*.orden").isNumeric(),
        body("sedeUuid", "Debe ser un uuid valido").isUUID("4"),
        body("tipoCarrera", "").isIn([
            TIPO_CARRERA.MODULAR,
            TIPO_CARRERA.SEMESTRAL,
        ]),
        body("duracionMeses").isNumeric(),
        validateFields,
    ],
    careerController.postCareer
);

/**
 * @swagger
 * /career:
 *  get:
 *      summary: Listado de carreras
 *      tags: [Career]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: query
 *           name: sede
 *           schema:
 *              type: string
 *              format: uuid
 *           description: El uuid de la sede
 *      responses:
 *          200:
 *              description: El listado de carreras
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
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        query("sede").isUUID("4"),
    ],
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
        param("uuid").isUUID("4"),
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
        param("name").isString(),
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
        param("uuid").isUUID("4"),
        validateFields,
    ],
    careerController.getModulesOfCareer
);

/**
 * @swagger
 * /career/schedules/{uuid}:
 *  get:
 *      summary: Obtener los horarios de una carrera
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
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/schedules/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    careerController.getSchedulesOfCareer
);

/**
 * @swagger
 * /career/{id}:
 *  patch:
 *      summary: Modificar una carrera
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: id
 *            schema:
 *                 type: string
 *                 format: uuid
 *            required: true
 *            description: El uuid de la carrera
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Career'
 *      responses:
 *          200:
 *              description: La carrera actualizada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/CareerResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.patch(
    "/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
        param("id").isUUID("4"),
        validateFields,
    ],
    careerController.updateCareer
);

/**
 * @swagger
 * /career/add-module/{id}:
 *  patch:
 *      summary: Agregar un modulo a una carrera
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: id
 *            schema:
 *                 type: string
 *                 format: uuid
 *            required: true
 *            description: El uuid de la carrera
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          nombre:
 *                              type: string
 *                          duracion_semanas:
 *                              type: string
 *      responses:
 *          200:
 *              description: La carrera actualizada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/CareerResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.patch(
    "/add-module/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
        param("id").isUUID("4"),
        validateFields,
    ],
    careerController.patchAddModule
);

/**
 * @swagger
 * /career/remove-module/{id}:
 *  patch:
 *      summary: Eliminar un modulo a una carrera
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: id
 *            schema:
 *                 type: string
 *                 format: uuid
 *            required: true
 *            description: El uuid de la carrera
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                              moduloUuid:
 *                                  type: string
 *                                  format: uuid
 *      responses:
 *          200:
 *              description: La carrera actualizada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/CareerResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.patch(
    "/remove-module/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
        param("id").isUUID("4"),
        body("moduloUuid").isUUID("4"),
        validateFields,
    ],
    careerController.patchRemoveModule
);

/**
 * @swagger
 * /career/{uuid}:
 *  delete:
 *      summary: Eliminar una carrera (eliminacion logica)
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            schema:
 *                 type: string
 *                 format: uuid
 *            required: true
 *            description: El uuid de la carrera
 *      responses:
 *          200:
 *              description: La carrera eliminada (eliminacion logica)
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/CareerResponse'
 *          404:
 *              description: La carrera no esta registrada en la base de datos
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: El nombre del error
 *                              msg:
 *                                  type: string
 *                                  example: "Carrera not found"
 *
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
    careerController.delete
);
export default router;
