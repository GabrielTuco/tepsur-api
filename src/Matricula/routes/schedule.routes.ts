import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body, param, query } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { ScheduleService } from "../services/schedule.service";

const router = Router();
const service = new ScheduleService();
const scheduleController = new ScheduleController(service);

/**
 * @swagger
 * components:
 *  schemas:
 *      Schedule:
 *          properties:
 *              dias:
 *                  type: array
 *                  items:
 *                      type: string
 *                      example: "Lun"
 *                  description: Los dias que esta asignado el horario
 *              horaInicio:
 *                  type: string
 *                  description: Hora de inicio del horario (hh:mm) en formato de 24 horas
 *              horaFin:
 *                  type: string
 *                  description: Hora de finalizacion del horario (hh:mm) en formato de 24 horas
 *          example:
 *              dias: ["L","M","J"]
 *              horaInicio: "08:00"
 *              horaFin: "11:00"
 *      ScheduleResponse:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *              dias:
 *                  type: array
 *                  items:
 *                      type: string
 *                      example: "Lun"
 *                  description: Los dias que esta asignado el horario
 *              hora_inicio:
 *                  type: string
 *                  description: Hora de inicio del horario
 *              hora_fin:
 *                  type: string
 *                  description: Hora de finalizacion del horario
 */

/**
 * @swagger
 * tags:
 *  name: Schedule
 *  description: Endpoints para los horarios
 */

/**
 * @swagger
 * /schedule:
 *  post:
 *      summary: Registrar un horario
 *      tags: [Schedule]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Schedule'
 *      responses:
 *          200:
 *              description: EL horario registrado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ScheduleResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN]),
        body(["dias"], "Este campo es obligatorio").isArray(),
        body(["horaInicio", "horaFin"], "Debe ser un string").isString(),
        validateFields,
    ],
    scheduleController.postSchedule
);

/**
 * @swagger
 * /schedule:
 *  get:
 *      summary: Listado de horarios
 *      tags: [Schedule]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: Listado de horarios
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/ScheduleResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    scheduleController.getAll
);

/**
 * @swagger
 * /schedule/list-by-secretary/{uuid}:
 *  get:
 *      summary: Listado de horarios de los grupos de una secretaria
 *      tags: [Schedule]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: uuid
 *           required: true
 *           description: Uuid de la secretaria
 *           schema:
 *              type: string
 *              format: uuid
 *      responses:
 *          200:
 *              description: Listado de horarios de los grupos de una secretaria
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/ScheduleResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/list-by-secretary/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
        validateFields,
    ],
    scheduleController.getAll
);

/**
 * @swagger
 * /schedule/{id}:
 *  get:
 *      summary: Buscar un horario por su uuid
 *      tags: [Schedule]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El id del usuario
 *      responses:
 *          200:
 *              description: Listado de horarios
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ScheduleResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/:id",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN])],
    scheduleController.getByUuid
);

/**
 * @swagger
 * /schedule/list-by-career/{uuid}:
 *  get:
 *      summary: Obtener el listado de horarios activos de una carrera
 *      tags: [Schedule]
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
 *              description: Listado de horarios activos de la carrera
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              $ref: '#/components/schemas/ScheduleResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/list-by-career/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
        validateFields,
    ],
    scheduleController.getByCareer
);

/**
 * @swagger
 * /schedule/{id}:
 *  patch:
 *      summary: Actualizar la informacion de un horario
 *      tags: [Schedule]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El id del usuario
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Schedule'
 *      responses:
 *          200:
 *              description: El horario actualizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/ScheduleResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.patch(
    "/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN]),
        param("id").isUUID("4"),
        validateFields,
    ],
    scheduleController.patchSchedule
);

/**
 * @swagger
 * /schedule/{id}:
 *  delete:
 *      summary: Elimina un horario(eliminacion logica)
 *      tags: [Schedule]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *              format: uuid
 *           required: true
 *           description: El id del usuario
 *      responses:
 *          200:
 *              description: Mensaje de confirmacion de eliminacion
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *                                  description: Mensaje de confirmacion
 *          500:
 *              description: Error de servidor
 *
 */
router.delete(
    "/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN]),
        param("id").isUUID("4"),
        validateFields,
    ],
    scheduleController.deleteSchedule
);

export default router;
