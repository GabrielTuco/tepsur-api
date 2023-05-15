import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { body } from "express-validator";
import { isRoleValid } from "../../middlewares/isRoleValid";
import { validateFields } from "../../middlewares/validateFields";
import { validateJWT } from "../../middlewares/validateJWT";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          properties:
 *              id:
 *                  type: number
 *                  description : El id autogenerado del usuario
 *              codRol:
 *                  type: number
 *                  description: El codigo del rol
 *              codSecretary:
 *                  type: number
 *                  description: El codigo de la secretaria para la que se va a crear el usuario
 *              user:
 *                  type: string
 *                  description: El nombre del nuevo usuario
 *              password:
 *                  type: string
 *                  description: El password del nuevo usuario
 *          required:
 *              - user
 *              - password
 *              - codRol
 *              - codSecretary
 *  parameters:
 *      token:
 *          in: header
 *          name: x-token
 *          required: true
 *          schema:
 *              type: string
 *              description: JWT de autenticacion
 */

/**
 * @swagger
 * tags:
 *  name: Auth
 *  description: Endpoints para la autenticacion
 */

/**
 * @swagger
 * /auth/login:
 *  post:
 *      summary: Realizar la autenticacion
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      items:
 *                          usuario:
 *                              type: string
 *                              description: Nombre de usuario
 *                          password:
 *                              type: string
 *                              description: Contraseña del usuario
 *      responses:
 *          200:
 *              description: El usuario con sus respectiva informacion y su token de autenticacion
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/login",
    [
        body("usuario", "Este campo es obligatorio").isString(),
        body("password", "Este campo es obligatorio").isString(),
        validateFields,
    ],
    authController.postLogin
);

/**
 * @swagger
 * /auth/renew:
 *  get:
 *      summary: Actualizar el token de autenticacion
 *      tags: [Auth]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: El nuevo token de autenticacion renovado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *
 *          500:
 *              description: Error de servidor
 *
 */
router.get("/renew", validateJWT, authController.revalidateToken);

/**
 * @swagger
 * /auth/updatePassword:
 *  put:
 *      summary: Actualizar el password de usuario
 *      tags: [Auth]
 *      parameters:
 *         - $ref: '#/components/parameters/token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          codUser:
 *                              type: number
 *                              description: Codigo del usuario
 *                          currentPassword:
 *                              type: string
 *                              description: El password actual
 *                          newPassword:
 *                              type: string
 *                              description: El nuevo password seguro
 *      responses:
 *          200:
 *              description: El nuevo token de autenticacion renovado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: number
 *                                  description: El id del usuario
 *                              usuario:
 *                                  type: string
 *                                  description: El nombre de usuario
 *                              password:
 *                                  type: string
 *                                  description: El hash del nuevo password
 *                              securePasswordUpdated:
 *                                  type: boolean
 *                                  description: Indica estado del password seguro del usuario
 *
 *          500:
 *              description: Error de servidor
 *
 */
router.put(
    "/updatePassword",
    [
        validateJWT,
        body("codUser", "El campo es obligatorio").isNumeric(),
        body("currentPassword", "El campo es obligatorio").exists(),
        body(
            "newPassword",
            "El password debe tener 8 caracteres como minimo"
        ).isLength({
            min: 8,
        }),
        validateFields,
    ],
    authController.changePassword
);

export default router;
