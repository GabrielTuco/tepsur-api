import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();
const scheduleController = new ScheduleController();

/**
 * @swagger
 * components:
 *  schemas:
 *      Schedule:
 *          properties:
 *              turno:
 *                  type: string
 *                  description: El turno al que pertenece el horario
 *              dias:
 *                  type: string
 *                  description: Los dias que esta asignado el horario
 *              horaInicio:
 *                  type: number
 *                  description: Hora de inicio del horario
 *              horaFin:
 *                  type: number
 *                  description: Hora de finalizacion del horario
 *
 *      ScheduleResponse:
 *          properties:
 *              id:
 *                  type: number
 *                  description : El id autogenerado del horario
 *              uuid:
 *                  type: string
 *                  format: uuid
 *              turno:
 *                  type: string
 *                  description: El turno al que pertenece el horario
 *              dias:
 *                  type: string
 *                  description: Los dias que esta asignado el horario
 *              hora_inicio:
 *                  type: number
 *                  description: Hora de inicio del horario
 *              hora_fin:
 *                  type: number
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
        checkAuthRole([ROLES.ADMIN]),
        body(["turno", "dias"], "Este campo es obligatorio").isString(),
        body(["horaInicio", "horaFin"], "Debe ser un numero").isNumeric(),
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
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Schedule'
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
    [validateJWT, checkAuthRole([ROLES.ADMIN])],
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
    [validateJWT, checkAuthRole([ROLES.ADMIN])],
    scheduleController.getByUuid
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
        checkAuthRole([ROLES.ADMIN]),
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
        checkAuthRole([ROLES.ADMIN]),
        param("id").isUUID("4"),
        validateFields,
    ],
    scheduleController.deleteSchedule
);

export default router;
