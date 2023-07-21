import { Router } from "express";
import { MatriculaEspecializacionController } from "../controllers/matriculaEspecializacion.controller";
import { MatriculaEspecilizacionService } from "../services/matriculaEspecializacion.service";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import {
    isAlumnoCorreoValid,
    isAlumnoDniValid,
} from "../../Matricula/middlewares/validations";

const router = Router();
const matriculaEspeService = new MatriculaEspecilizacionService();
const matriculaEspeController = new MatriculaEspecializacionController(
    matriculaEspeService
);
/**
 * @swagger
 * components:
 *  schemas:
 *      MatriculaEspecializacion:
 *          properties:
 *              alumno:
 *                  type: object
 *                  $ref: '#/components/schemas/Alumno'
 *                  description: Datos del alumno
 *              especializacionUuid:
 *                  type: string
 *                  format: uuid
 *                  description:  Uuid de la especializacion
 *              secretariaUuid:
 *                  type: string
 *                  format: uuid
 *                  description:  Uuid de la secretaria que registra
 *              sedeUuid:
 *                  type: string
 *                  format: uuid
 *                  description:  Uuid de la sede
 *              pagoMatricula:
 *                  type: object
 *                  $ref: '#/components/schemas/PagoMatricula'
 *                  description: Informacion del pago de la matricula
 *              horario:
 *                  type: object
 *                  $ref: '#/components/schemas/Schedule'
 *              fechaInscripcion:
 *                  type: string
 *                  format: date-time
 *                  description:  Fecha de inscripcion
 *              fechaInicio:
 *                  type: string
 *                  format: date-time
 *                  description:  Fecha de inicio de clases
 */

/**
 * @swagger
 * tags:
 *  name: MatriculaEspecializacion
 *  description: Endpoints para las matriculas en especializaciones
 */

/**
 * @swagger
 * /matricula-especializacion:
 *  post:
 *      summary: Registrar una nueva matricula de especializacion
 *      tags: [MatriculaEspecializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/MatriculaEspecializacion'
 *      responses:
 *          200:
 *              description: La matricula registrada del alumno
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MatriculaEspecializacion'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        body("alumno").isObject(),
        body("alumno.dni").isString().isLength({ min: 8, max: 8 }),
        body("alumno.dni").custom(isAlumnoDniValid),
        body("alumno.nombres").isString(),
        body("alumno.apePaterno").isString(),
        body("alumno.apeMaterno").isString(),
        body("alumno.sexo", "Valores aceptados: 'm'|'f' ").isIn(["m", "f"]),
        body("alumno.edad").isNumeric(),
        body(
            "alumno.gradoEstudiosUuid",
            "El valor debe ser un UUID valido"
        ).isNumeric(),
        body("alumno.lugarResidencia").isString(),
        body("alumno.celular", "No es un numero de celular valido")
            .isString()
            .isLength({ min: 9, max: 9 }),
        body("alumno.celularReferencia", "No es un numero de celular valido")
            .optional()
            .isString()
            .isLength({ min: 9, max: 9 }),
        body("alumno.correo", "No es un correo valido").isEmail(),
        body("alumno.correo").custom(isAlumnoCorreoValid),
        body("alumno.direccion").isObject(),
        body("alumno.direccion.direccionExacta").isString(),
        body("alumno.direccion.distrito").isString(),
        body("alumno.direccion.provincia").isString(),
        body("alumno.direccion.departamento").isString(),
        //Datos academicos
        body("especializacionUuid", "El valor debe ser un UUID").isUUID("4"),
        body("secretariaUuid", "El valor debe ser un UUID").isUUID("4"),
        body("sedeUuid").isUUID("4"),
        body("horario").isObject(),
        body("horario.dias").isArray(),
        body("horario.dias.*").isString(),
        body("horario.horaInicio").isString(),
        body("horario.horaFin").isString(),
        body("fechaInscripcion").isString(),
        body("fechaInicio").isString(),
        //Pago de matricula(opcional)
        body("pagoMatricula").optional().isObject(),
        body("pagoMatricula.numComprobante").optional().isString(),
        body("pagoMatricula.formaPagoUuid").optional().isNumeric(),
        body("pagoMatricula.monto").optional().isNumeric(),
        validateFields,
    ],
    matriculaEspeController.postMatricula
);

/**
 * @swagger
 * /matricula-especializacion:
 *  get:
 *      summary: Listado de matriculas de especializacion
 *      tags: [MatriculaEspecializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: El listado de matriculas
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/MatriculaEspecializacion'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ADMIN, ROLES.SECRE])],
    matriculaEspeController.getList
);

/**
 * @swagger
 * /matricula-especializacion/{uuid}:
 *  get:
 *      summary: Busqueda de una matricula por uuid
 *      tags: [MatriculaEspecializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format: uuid
 *            description: EL uuid de la matricula
 *      responses:
 *          200:
 *              description: La matricula buscada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/MatriculaEspecializacion'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid", "Debe ser un uuid valido").isUUID("4"),
        validateFields,
    ],
    matriculaEspeController.getOne
);

/**
 * @swagger
 * /matricula-especializacion/{uuid}:
 *  put:
 *      summary: Actualizar una matricula
 *      tags: [MatriculaEspecializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format: uuid
 *            description: EL uuid de la matricula
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/MatriculaEspecializacion'
 *      responses:
 *          200:
 *              description: La matricula actualizada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MatriculaEspecializacion'
 *          500:
 *              description: Error de servidor
 *
 */
router.put(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID("4"),
        validateFields,
    ],
    matriculaEspeController.update
);

/**
 * @swagger
 * /matricula-especializacion/{uuid}:
 *  delete:
 *      summary: Eliminar una matricula(no funca xd)
 *      tags: [MatriculaEspecializacion]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format: uuid
 *            description: EL uuid de la matricula
 *      responses:
 *          200:
 *              description: La matricula "eliminada"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/MatriculaEspecializacion'
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
    matriculaEspeController.delete
);

export default router;
