import { Router } from "express";
import { postSecretary } from "../controllers/secretary.controller";
import { body } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { isAdminRole } from "../../middlewares/isAdminRole";

const router = Router();

/**
 * @swagger
 * components:
 *  schemas:
 *      Secretary:
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
 *              celular:
 *                  type: string
 *                  description: Celular
 *              correo:
 *                  type: string
 *                  description: Correo
 *              codSede:
 *                  type: number
 *                  description: El codigo de la sede en la que se registra la secretaria
 *              codRol:
 *                  type: number
 *                  description: El tipo de usuario(rol)
 *              userCodRol:
 *                  type: number
 *                  description: El rol del usuario que realiza la peticion
 *          required:
 *              - dni
 *              - nombre
 *              - apePaterno
 *              - apeMaterno
 *              - codSede
 *              - codRol
 *              - userCodRol
 */

/**
 * @swagger
 * tags:
 *  name: Secretary
 *  description: Endpoints para la secretaria
 */

/**
 * @swagger
 * /secretary:
 *  post:
 *      summary: Crea una nueva secretaria con su respectivo usuario por defecto
 *      tags: [Secretary]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Secretary'
 *      responses:
 *          200:
 *              description: La secretaria con su nuevo usuario creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Secretary'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        body("dni", "Debe de contener 8 caracteres").isString(),
        body("nombres", "Este campo es obligatorio").isString(),
        body("apePaterno", "Este campo es obligatorio").isString(),
        body("apeMaterno", "Este campo es obligatorio").isString(),
        body("codSede", "Este campo es obligatorio").isNumeric(),
        body("codRol", "Este campo es obligatorio").isNumeric(),
        body("userCodRol", "ESte campo es obligatorio").custom(isAdminRole),
        validateFields,
    ],
    postSecretary
);

//router.post("/createSecretaryUser", [], );

export default router;
