import { Router } from "express";
import { validateJWT } from "../../middlewares/validateJWT";
import { PensionController } from "../controllers/pension.controller";
import { PensionService } from "../services/pension.service";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES, TIPO_ENTIDAD_FINANCIERA } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();
const pensionService = new PensionService();
const pensionController = new PensionController(pensionService);

/**
 * @swagger
 * components:
 *  schemas:
 *      PagoPension:
 *          properties:
 *              formaPagoUuid:
 *                  type: number
 *                  example: 2
 *                  description: UUID del tipo de forma de pago
 *              fecha:
 *                  type: string
 *                  format: date-time
 *              hora:
 *                  type: string
 *              numComprobante:
 *                  type: string
 *                  description: Numero de comprobante
 *              monto:
 *                  type: number
 *                  description: El monto a pagar(puede ser menor o igual al monto de la pension)
 *              entidad:
 *                  type: string
 *                  enum: [yape, banco de la nacion, caja cuzco, caja arequipa, bcp, oficina]
 *                  description: La entidad financiera
 */

/**
 * @swagger
 * tags:
 *  name: Pension
 *  description: Endpoints para la gestion de pagos pensiones o deudas
 */

/**
 * @swagger
 * /pensiones/pagos:
 *  get:
 *      summary: Listado de pagos
 *      tags: [Pension]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: El listado de pagos
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
    "/pagos",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    pensionController.getListPagos
);

router.get("/:dni", [validateJWT], pensionController.getByDni);

/**
 * @swagger
 * /pensiones/pago/{uuid}:
 *  get:
 *      summary: Pagar una pension
 *      tags: [Pension]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format : uuid
 *      responses:
 *          200:
 *              description: El registro de pago buscado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              pension:
 *                                  type: object
 *                              forma_pago:
 *                                  type: object
 *                              fecha:
 *                                  type: string
 *                                  format: date-time
 *                              hora:
 *                                  type: string
 *                              monto:
 *                                  type: number
 *                              num_comprobante:
 *                                  type: string
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/pago/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
        validateFields,
    ],
    pensionController.getListPagos
);

/**
 * @swagger
 * /pensiones/pagar/{uuid}:
 *  post:
 *      summary: Pagar una pension
 *      tags: [Pension]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            required: true
 *            schema:
 *              type: string
 *              format: uuid
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PagoPension'
 *      responses:
 *          200:
 *              description: El registro de la pension pagada
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
    "/pagar/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
        body("formaPagoUuid").isNumeric(),
        body(["fecha", "hora", "numComprobante"]).isString(),
        body("monto").isNumeric(),
        body("entidad").isIn(Object.values(TIPO_ENTIDAD_FINANCIERA)),
        validateFields,
    ],
    pensionController.postPagoPension
);

/**
 * @swagger
 * /pensiones/upload-payment-document/{uuid}:
 *  put:
 *      summary: Subir el documento de pago del pago de una pension
 *      tags: [Pension]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            schema:
 *              type: string
 *              format: uuid
 *            required: true
 *            description: Uuid del pago de pension
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
 *              description: El pago de la pension actualizado con la foto del comprobante
 *              content:
 *                  application/json:
 *                       schema:
 *                          type: object
 *          500:
 *              description: Error de servidor
 *
 */
router.put(
    "/upload-payment-document/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
    ],
    pensionController.putUploadPaidDocument
);

export default router;
