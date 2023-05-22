import { Router } from "express";
import { MatriculaController } from "../controllers/matricula.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();

const matriculaController = new MatriculaController();

/**
 * @swagger
 * components:
 *  schemas:
 *      Alumno:
 *          properties:
 *              id:
 *                  type: number
 *                  description : El id autogenerado de la secretaria
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
 *              sexo:
 *                  type: string
 *                  description: Sexo
 *              edad:
 *                  type: number
 *                  description: Edad del alumno
 *              gradoEstudiosUuid:
 *                  type: string
 *                  format: uuid
 *                  description: Grado de estudios del almuno
 *              lugarNacimiento:
 *                  type: string
 *                  description: Lugar de nacimiento
 *              celular:
 *                  type: string
 *                  description: Celular
 *              correo:
 *                  type: string
 *                  description: Correo
 *              direccion:
 *                  type: object
 *                  $ref: '#/components/schemas/Direccion'
 *                  description: El codigo de la sede en la que se registra la secretaria
 *          required:
 *              - dni
 *              - nombre
 *              - apePaterno
 *              - apeMaterno
 *              - sexo
 *              - edad
 *              - gradoEstudiosUuid
 *              - lugarNacimiento
 *              - celular
 *              - correo
 *              - direccion
 *      PagoMatricula:
 *          properties:
 *              numComprobante:
 *                  type: string
 *                  description: Numero de comprobante
 *              formaPagoUuid:
 *                  type: string
 *                  description: UUID del tipo de forma de pago
 *              monto:
 *                  type: number
 *                  description: Monto de pago
 *      Matricula:
 *          properties:
 *              alumno:
 *                  type: object
 *                  $ref: '#/components/schemas/Alumno'
 *                  description: Datos del alumno
 *              carreraUuid:
 *                  type: string
 *                  format: uuid
 *                  description:  Uuid de la carrera
 *              moduloUuid:
 *                  type: string
 *                  format: uuid
 *                  description:  Uuid del modulo de la carrera
 *              grupoUuid:
 *                  type: string
 *                  format: uuid
 *                  description:  Uuid del grupo
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
 *              fechaInscripcion:
 *                  type: string
 *                  format: datetime
 *                  description:  Fecha de inscripcion
 *              fechaInicio:
 *                  type: string
 *                  format: datetime
 *                  description:  Fecha de inicio de clases
 */

/**
 * @swagger
 * tags:
 *  name: Matricula
 *  description: Endpoints para las matriculas
 */

/**
 * @swagger
 * /matricula:
 *  post:
 *      summary: Registrar una nueva matricula del estudiante
 *      tags: [Matricula]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Matricula'
 *      responses:
 *          200:
 *              description: La secretaria con su nuevo usuario creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Matricula'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        //validateJWT,
        //checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        body("alumno").isObject(),
        body("alumno.dni").isString(),
        body("alumno.nombres").isString(),
        body("alumno.apePaterno").isString(),
        body("alumno.apeMaterno").isString(),
        body("alumno.sexo", "Los valores permitidos son: 'm' o 'f' ").isIn([
            "m",
            "f",
        ]),
        body("alumno.edad").isNumeric(),
        body(
            "alumno.gradoEstudiosUuid",
            "El valor debe ser un UUID valido"
        ).isUUID("4"),
        body("alumno.lugarNacimiento").isString(),
        body("alumno.celular", "No es un numero de celular valido")
            .isString()
            .isLength({ min: 9, max: 9 }),
        body("alumno.correo", "No es un correo valido").isEmail(),
        body("alumno.direccion").isObject(),
        body("alumno.direccion.direccionExacta").isString(),
        body("alumno.direccion.distrito").isString(),
        body("alumno.direccion.provincia").isString(),
        body("alumno.direccion.departamento").isString(),
        body("carreraUuid", "El valor debe ser un UUID valido").isUUID("4"),
        body("moduloUuid", "El valor debe ser un UUID valido").isUUID("4"),
        body("grupoUuid", "El valor debe ser un UUID valido").isUUID("4"),
        body("secretariaUuid", "El valor debe ser un UUID valido").isUUID("4"),
        body("sedeUuid").isNumeric(),
        body("pagoMatricula").isObject(),
        body("pagoMatricula.numComprobante").isString(),
        body("pagoMatricula.formaPago").isString(),
        body("pagoMatricula.monto").isNumeric(),
        body("fechaInscripcion").isString(),
        validateFields,
    ],
    matriculaController.postMatricula
);

/**
 * @swagger
 * /matricula/grado-estudio:
 *  post:
 *      summary: Registrar un nuevo tipo de grado de estudio
 *      tags: [Matricula]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          descripcion:
 *                              type: string
 *                              description: La descripcion del grado de estudio
 *      responses:
 *          200:
 *              description: El graode estudio registrado
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *                          properties:
 *                              descripcion:
 *                                  type: string
 *                                  description: La descripcion del grado de estudio
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/grado-estudio",
    [
        //validateJWT,
        //checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        body("descripcion").exists(),
        validateFields,
    ],
    matriculaController.postGradoEstudio
);

/**
 * @swagger
 * /matricula/validate-dni-1/{dni}:
 *  get:
 *      summary: Validar el dni de un nuevo alumno
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: dni
 *            schema:
 *              type: string
 *            required: true
 *            description: El dni del alumno a buscar
 *      responses:
 *          200:
 *              description: Los datos del nuevo almuno
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *                          properties:
 *                              descripcion:
 *                                  type: string
 *                                  description: La descripcion del grado de estudio
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/validate-dni-1/:dni",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("dni", "Debe ser un DNI valido")
            .isString()
            .isLength({ min: 8, max: 8 }),
    ],
    matriculaController.getValidateDniBasic
);

router.get(
    "/grado-estudio",
    [
        //validateJWT,
        //checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    ],
    matriculaController.getGradosEstudio
);

router.get(
    "/generate-pdf/:id",
    [
        //validateJWT,
        //checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("id", "Debe ser un ID valido").isUUID("4"),
        validateFields,
    ],
    matriculaController.getGeneratedPDF
);

export default router;
