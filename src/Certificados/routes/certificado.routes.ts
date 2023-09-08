import { Router } from "express";
import { body, param } from "express-validator";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { CertificadoService } from "../service/certificado.service";
import { CertificadoController } from "../controller/certificado.controller";
import { ROLES } from "../../interfaces/enums";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();

const certificadoService = new CertificadoService();
const certificadoController = new CertificadoController(certificadoService);

/**
 * @swagger
 * components:
 *  schemas:
 *      Certificado:
 *         properties:
 *            uuid:
 *                type: string
 *                format: uuid
 *            description:
 *                type: string
 *            url:
 *                type: string
 *            matricula:
 *                type: object
 */

/**
 * @swagger
 * tags:
 *  name: Certificados
 *  description: Endpoints para los certificados
 */

/**
 * @swagger
 * /certificados:
 *  post:
 *      summary: Registar un nuevo certificado
 *      tags: [Certificados]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
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
 *                          descripcion:
 *                              type: string
 *                          matriculaUuid:
 *                              type: string
 *                              format: uuid
 *      responses:
 *          200:
 *              description: El certificado registrado
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        body("descripcion").isString(),
        body("matriculaUuid").isUUID(4),
        // body("image").exists(),
        validateFields,
    ],
    certificadoController.postCertificado
);

/**
 * @swagger
 * /certificados/{uuid}:
 *  get:
 *      summary: Buscar un certificado por uuid
 *      tags: [Certificados]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format: uuid
 *            description: uuid de la matricula
 *      responses:
 *          200:
 *              description: El certificado buscado
 *              content:
 *                  application/json:
 *                       schema:
 *                          $ref: '#/components/schemas/Certificado'
 *
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/:uuid",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    certificadoController.getByUuid
);

/**
 * @swagger
 * /certificados/matricula/{uuid}:
 *  get:
 *      summary: Buscar los certificados de una matricula
 *      tags: [Certificados]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format: uuid
 *            description: uuid de la matricula
 *      responses:
 *          200:
 *              description: El listado de certificados
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Certificado'
 *
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/matricula/:uuid",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    certificadoController.getByMatricula
);

/**
 * @swagger
 * /certificados:
 *  get:
 *      summary: Listar todos los certificados
 *      tags: [Certificados]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: El listado de certificados
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Certificado'
 *
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    certificadoController.getAll
);

/**
 * @swagger
 * /certificados/{uuid}:
 *  delete:
 *      summary: Buscar los certificados de una matricula
 *      tags: [Certificados]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format: uuid
 *            description: uuid de la matricula
 *      responses:
 *          200:
 *              description: El listado de certificados
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *                          properties:
 *                              uuid:
 *                                  type: string
 *                                  format: uuid
 *                                  description: el uuid del certificado eliminado
 *
 *          500:
 *              description: Error de servidor
 *
 */
router.delete(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
        validateFields,
    ],
    certificadoController.deleteCertificado
);

export default router;
