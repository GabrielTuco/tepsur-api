import { Router } from "express";
import { body, param } from "express-validator";
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
 *                          horarios:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      horaInicio:
 *                                          type: string
 *                                          example: '08:00'
 *                                      horaFin:
 *                                          type: string
 *                                          example: '11:00'
 *                                      dias:
 *                                          type: array
 *                                          items:
 *                                              type: string
 *                                              example: ['Lun','Mar','Vie']
 *                          docenteUuid:
 *                              type: string
 *                              format: uuid
 *                              description: El docente que dicta el modulo
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
 *                              example: '4 semanas'
 *                          horarios:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      hora_inicio:
 *                                          type: string
 *                                          example: '08:00'
 *                                      hora_fin:
 *                                          type: string
 *                                          example: '11:00'
 *                                      dias:
 *                                          type: array
 *                                          items:
 *                                              type: string
 *                                              example: ['Lun','Mar','Vie']
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
        body("modulos.*.docenteUuid").isUUID("4"),
        body("modulos.*.horarios").isArray(),
        body("modulos.*.horarios.*").isObject(),
        body("modulos.*.horarios.*.horaInicio").isString(),
        body("modulos.*.horarios.*.horaFin").isString(),
        body("modulos.*.horarios.*.dias").isArray(),
        body("modulos.*.horarios.*.dias.*").isString(),
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

export default router;
