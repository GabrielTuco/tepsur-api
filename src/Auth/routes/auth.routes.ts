import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { body } from "express-validator";
import { isRoleValid } from "../../middlewares/isRoleValid";
import { validateFields } from "../../middlewares/validateFields";

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
 *      summary: Realizar la autenticacion de la secretaria (BETA :v)
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
        body("codRol", "Este campo es obligatorio").isNumeric(),
        body("codRol").custom(isRoleValid),
        validateFields,
    ],
    authController.postLogin
);

export default router;
