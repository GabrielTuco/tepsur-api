import { Router } from "express";
import { validateJWT } from "../../middlewares/validateJWT";
import { PensionController } from "../controllers/pension.controller";
import { PensionService } from "../services/pension.service";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
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
 */

/**
 * @swagger
 * tags:
 *  name: Pension
 *  description: Endpoints para la gestion de pagos pensiones o deudas
 */

router.get("/:dni", [validateJWT], pensionController.getByDni);

router.get(
    "/pagos",
    [validateJWT, checkAuthRole([ROLES.ADMIN, ROLES.SECRE])],
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
router.post("/pagar/:uuid", [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    param("uuid").isUUID(4),
    body("formaPagoUuid").isUUID(4),
    body(["fecha", "hora", "numComprobante", "entidadBancaria"]).isString(),
    validateFields,
]);

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
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
    ],
    pensionController.putUploadPaidDocument
);

export default router;
