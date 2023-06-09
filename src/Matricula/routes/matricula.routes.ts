import { Router } from "express";
import { MatriculaController } from "../controllers/matricula.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { MODALIDAD, ROLES, TIPO_MATRICULA } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();

const matriculaController = new MatriculaController();

/**
 * @swagger
 * components:
 *  schemas:
 *      PagoMatricula:
 *          properties:
 *              numComprobante:
 *                  type: string
 *                  description: Numero de comprobante
 *              formaPagoUuid:
 *                  type: number
 *                  example: 2
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
 *              modulos:
 *                  type: array
 *                  items:
 *                      type: object
 *                      properties:
 *                          uuid:
 *                              type: string
 *                              format: uuid
 *                              description:  Uuid de los modulos de la carrera
 *                          modalidad:
 *                              type: string
 *                              enum: [virtual, presencial]
 *                              description: La modalidad en la que se va llevar el modulo
 *                          fechaInicio:
 *                              type: string
 *                              format: date-time
 *                              description: La fecha de inicio del modulo
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
 *              tipoMatricula:
 *                  type: string
 *                  description: El tipo de matricula que se registra
 *                  enum: [nuevo,reingreso]
 *                  example: "nuevo"
 *              fechaInscripcion:
 *                  type: string
 *                  format: date-time
 *                  description:  Fecha de inscripcion
 *              fechaInicio:
 *                  type: string
 *                  format: date-time
 *                  description:  Fecha de inicio de clases
 *      TrasladoMatricula:
 *          properties:
 *              alumno:
 *                  type: object
 *                  $ref: '#/components/schemas/Alumno'
 *                  description: Datos del alumno
 *              carreraUuid:
 *                  type: string
 *                  format: uuid
 *                  description:  Uuid de la carrera
 *              grupoUuid:
 *                  type: string
 *                  format: uuid
 *                  description:  Uuid del grupo
 *              modulosCompletos:
 *                  type: array
 *                  items:
 *                      type: string
 *                      format: uuid
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
 *              fechaInicio:
 *                  type: string
 *                  format: date-time
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
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Matricula'
 *      responses:
 *          200:
 *              description: La matricula registrada del alumno
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
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),

    //Datos personales del alumno
    body("alumno").isObject(),
    body("alumno.dni").isString().isLength({ min: 8, max: 8 }),
    body("alumno.nombres").isString(),
    body("alumno.apePaterno").isString(),
    body("alumno.apeMaterno").isString(),
    body("alumno.sexo", "Los valores permitidos son: 'm'|'f' ").isIn([
      "m",
      "f",
    ]),
    body("alumno.edad").isNumeric(),
    body(
      "alumno.gradoEstudiosUuid",
      "El valor debe ser un UUID valido"
    ).isNumeric(),
    body("alumno.lugarNacimiento").isString(),
    body("alumno.celular", "No es un numero de celular valido")
      .isString()
      .isLength({ min: 9, max: 9 }),
      body("alumno.celularReferencia", "No es un numero de celular valido")
      .optional()
      .isString()
      .isLength({ min: 9, max: 9 }),
    body("alumno.correo", "No es un correo valido").isEmail(),
    body("alumno.direccion").isObject(),
    body("alumno.direccion.direccionExacta").isString(),
    body("alumno.direccion.distrito").isString(),
    body("alumno.direccion.provincia").isString(),
    body("alumno.direccion.departamento").isString(),

    //Datos academicos
    body("carreraUuid", "El valor debe ser un UUID valido").isUUID("4"),
    body("modulos", "Debe ser un array de UUIDS").optional().isArray(),
    body("modulos.*", "El valor debe ser un UUID valido")
      .optional()
      .isObject(),
    //TODO: agregar middleware para ver si el horario pertenece a la carrera
    // body("horarioUuid", "El valor debe ser un UUID valido").optional().isUUID("4"),
    body(
      "tipoMatricula",
      "Los valores aceptados son: 'nuevo'|'reingreso'"
    ).isIn([TIPO_MATRICULA.NUEVO, TIPO_MATRICULA.REINGRESO]),
    body("secretariaUuid", "El valor debe ser un UUID valido").isUUID("4"),
    body("sedeUuid").isUUID("4"),
    body("fechaInscripcion").isString(),
    body("fechaInicio").optional().isString(),

    //Pago de matricula(opcional)
    body("pagoMatricula").optional().isObject(),
    body("pagoMatricula.numComprobante").optional().isString(),
    body("pagoMatricula.formaPagoUuid").optional().isNumeric(),
    body("pagoMatricula.monto").optional().isNumeric(),
    validateFields,
  ],
  matriculaController.postMatricula
);

/**
 * @swagger
 * /matricula/traslado:
 *  post:
 *      summary: Hacer un traslado interno del alumno para registrarlo en el nuevo sistema
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TrasladoMatricula'
 *      responses:
 *          200:
 *              description: El registro de la matricula del alumno trasladado
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
  "/traslado",
  [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),

    //Datos personales del alumno
    body("alumno").isObject(),
    body("alumno.dni").isString().isLength({ min: 8, max: 8 }),
    body("alumno.nombres").isString(),
    body("alumno.apePaterno").isString(),
    body("alumno.apeMaterno").isString(),
    body("alumno.sexo", "Los valores permitidos son: 'm'|'f' ").isIn([
      "m",
      "f",
    ]),
    body("alumno.edad").isNumeric(),
    body(
      "alumno.gradoEstudiosUuid",
      "El valor debe ser un UUID valido"
    ).isNumeric(),
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

    //Datos academicos
    body("carreraUuid", "El valor debe ser un UUID valido").isUUID("4"),
    body("grupoUuid", "El valor debe ser un UUID valido").isUUID("4"),
    body("moduloActualUuid", "El valor debe ser un UUID valido")
      .optional()
      .isUUID("4"),
    body("modulosCompletados", "Debe ser un array de UUIDS").isArray(),
    body("modulosCompletados.*", "El valor debe ser un UUID valido")
      .optional()
      .isUUID("4"),
    body("secretariaUuid", "El valor debe ser un UUID valido").isUUID("4"),
    body("sedeUuid").isUUID("4"),
    body("fechaInicio").isString(),

    //Pago de matricula
    body("pagoMatricula").isObject(),
    body("pagoMatricula.numComprobante").isString(),
    body("pagoMatricula.formaPagoUuid").isNumeric(),
    body("pagoMatricula.monto").isNumeric(),
    validateFields,
  ],
  matriculaController.postTrasladoMatricula
);

/**
 * @swagger
 * /matricula/upload-payment-document/{id}:
 *  post:
 *      summary: Subir el documento de pago de una matricula
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *              format: uuid
 *            required: true
 *            description: Uuid de la matricula
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          image:
 *                              type: string
 *                              format: binary
 *      responses:
 *          200:
 *              description: El pago de matricula actualizado con la foto del comprobante
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
  "/upload-payment-document/:id",
  [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    param("id").isUUID("4"),
  ],
  matriculaController.patchUploadPaidDocument
);

/**
 * @swagger
 * /matricula/update-pago/{uuid}:
 *  post:
 *      summary: Registrar los datos del pago de una matricula
 *      tags: [Matricula]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          numComprobante:
 *                              type: string
 *                          formaPagoUuid:
 *                              type: string
 *                              format: uuid
 *                          monto:
 *                              type: number
 *      responses:
 *          200:
 *              description: El pago de matricula registrado
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *          500:
 *              description: Error de servidor
 *
 */
router.patch(
  "/update-pago/:id",
  [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    param("id", "Debe ser un ID valido").isUUID("4"),
    body("numComprobante").isString(),
    body("formaPagoUuid").isUUID("4"),
    body("monto").isNumeric(),
    validateFields,
  ],
  matriculaController.patchPagoMatricula
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
 * /matricula/set-modules-to-matricula/{matriculaUuid}:
 *  put:
 *      summary: Establecer los modulos donde se matricula el alumno
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: matriculaUuid
 *            schema:
 *              type: string
 *              format: uuid
 *            required: true
 *            description: Uuid de la matricula
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          modulosMatricula:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  properties:
 *                                      uuid:
 *                                          type: string
 *                                          format: uuid
 *                                          description:  Uuid de los modulos de la carrera
 *                                      modalidad:
 *                                          type: string
 *                                          enum: [virtual, presencial]
 *                                          description: La modalidad en la que se va llevar el modulo
 *                                      fechaInicio:
 *                                          type: string
 *                                          format: date-time
 *                                          description: La fecha de inicio del modulo
 *      responses:
 *          200:
 *              description: La matricula con los modulos registrados
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Matricula'
 *          500:
 *              description: Error de servidor
 *
 */
router.put(
  "/set-modules-to-matricula/:matriculaUuid",
  [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    param("matriculaUuid").isUUID("4"),
    body("modulosMatricula").isArray(),
    body("modulosMatricula.*").isObject(),
    body("modulosMatricula.*.uuid").isUUID("4"),
    body("modulosMatricula.*.modalidad").isIn([
      MODALIDAD.VIRTUAL,
      MODALIDAD.PRESENCIAL,
    ]),
    body("moudlosMatricula.*.fechaInicio").isString(),
    validateFields,
  ],
  matriculaController.putSetModulesToMatricula
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
 *      parameters:
 *          - $ref: '#/components/parameters/token'
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

/**
 * @swagger
 * /matricula/modules:
 *  get:
 *      summary: Listado de modulos
 *      tags: [Matricula]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: El listado de modulos
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: array
 *                          items:
 *                               type: object
 *                               properties:
 *                                  uuid:
 *                                      type: string
 *                                      format: uuid
 *                                  descripcion:
 *                                      type: string
 *                                      description: El nombre del modulo
 *          500:
 *              description: Error de servidor
 *
 */
router.get("/modules", [validateJWT], matriculaController.getModules);
export default router;
