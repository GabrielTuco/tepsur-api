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
        body("pagoMatricula").optional().isObject(),
        body("pagoMatricula.numComprobante").optional().isString(),
        body("pagoMatricula.formaPagoUuid").optional().isUUID("4"),
        body("pagoMatricula.monto").optional().isNumeric(),
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
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
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

/**
 * @swagger
 * /matricula/grado-estudio:
 *  get:
 *      summary: Listado de los grados de estudios validos
 *      tags: [Matricula]
 *      responses:
 *          200:
 *              description: Listado de los grados de estudios
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  uuid:
 *                                      type: string
 *                                      format: uuid
 *                                      description: El uuid unico
 *                                  descripcion:
 *                                      type: string
 *                                      description: La descripcion del grado de estudio
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/grado-estudio",
    [validateJWT],
    matriculaController.getGradosEstudio
);

/**
 * @swagger
 * /matricula/generate-pdf/{id}:
 *  get:
 *      summary: PDF de ficha de matricula
 *      tags: [Matricula]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              format: uuid
 *            required: true
 *            description: Uuid de la matricula
 *      responses:
 *          200:
 *              description: PDF de ficha de matricula
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object

 *          500:
 *              description: Error de servidor
 *
 */
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

/**
 * @swagger
 * /matricula:
 *  get:
 *      summary: Listado de matriculas por año o mes
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: query
 *            name: year
 *            schema:
 *              type: number
 *            required: true
 *            description: Año de filtrado
 *          - in: query
 *            name: month
 *            schema:
 *              type: number
 *            required: false
 *            description: Mes de filtrado
 *      responses:
 *          200:
 *              description: Listado de matriculas
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                                type: object
 *                                $ref: '#/components/schemas/Matricula'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [
        //validateJWT,
        //checkAuthRole([ROLES.ADMIN,ROLES.SECRE]),
        //param("year").isNumeric(),
        //param("month").optional().isNumeric(),
        validateFields,
    ],
    matriculaController.getList
);

/**
 * @swagger
 * /matricula/utilidades/departamentos:
 *  get:
 *      summary: Listado de departamentos del peru
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: Listado de departamentos del peru
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  ubigeoId:
 *                                      type: string
 *                                      description: El codigo de ubigeo
 *                                  departamento:
 *                                      type: string
 *                                      description: El nombre del departamento
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/utilidades/departamentos",
    [validateJWT],
    matriculaController.getDepartments
);

/**
 * @swagger
 * /matricula/utilidades/provincias/{departamentoId}:
 *  get:
 *      summary: Listado de provincias de un departamento
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: departamentoId
 *            schema:
 *              type: string
 *            required: true
 *            description: El codigo de ubigeo del departamento
 *      responses:
 *          200:
 *              description: Listado de provincias de un departamento
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  ubigeoId:
 *                                      type: string
 *                                      description: El codigo de ubigeo
 *                                  provincia:
 *                                      type: string
 *                                      description: El nombre de la provincia
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/utilidades/provincias/:departamentoId",
    [validateJWT, param("departamentoId").exists(), validateFields],
    matriculaController.getProvinces
);

/**
 * @swagger
 * /matricula/utilidades/distritos/{departamentoId}/{provinciaId}:
 *  get:
 *      summary: Listado de distritos de un departamento
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: departamentoId
 *            schema:
 *              type: string
 *            required: true
 *            description: El codigo de ubigeo del departamento
 *          - in: path
 *            name: provinciaId
 *            schema:
 *              type: string
 *            required: true
 *            description: El codigo de ubigeo de la provincia del departamento
 *      responses:
 *          200:
 *              description: Listado de provincias de un departamento
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  ubigeoId:
 *                                      type: string
 *                                      description: El codigo de ubigeo
 *                                  distrito:
 *                                      type: string
 *                                      description: El nombre del distrito
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/utilidades/distritos/:departamentoId/:provinciaId",
    [
        validateJWT,
        param("departamentoId").exists(),
        param("provinciaId").exists(),
        validateFields,
    ],
    matriculaController.getDistricts
);

//TODO: documentar
router.patch(
    "/update-pago/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("id", "Debe ser un ID valido").isUUID("4"),
        validateFields,
    ],
    matriculaController.patchPagoMatricula
);
export default router;
