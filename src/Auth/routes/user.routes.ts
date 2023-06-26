import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * components:
 *  schemas:
 *      UserResponse:
 *          properties:
 *              uuid:
 *                  type: string
 *                  format: uuid
 *                  description : El uuid del usuario
 *              usuario:
 *                  type: string
 *                  description: El nombre de usuario
 *              avatar:
 *                  type: string
 *                  description: La url de la imagen el avatar subida al servidor
 *              securePasswordUpdated:
 *                  type: boolean
 *                  description: Indica si el usuario ha actualizado su password por defecto
 *              rol:
 *                  type: object
 *                  properties:
 *                      uuid:
 *                          type: string
 *                          format: uuid
 *                          description: El uuid del rol de usuario
 *                      nombre:
 *                          type: string
 *                          description: EL nombre de rol de usuario
 *          example:
 *              uuid: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *              usuario: Test
 *              avatar: https://res.cloudinary.com/dvoo0vvff/image/upload/v1684428107/tepsur/user-avatars/tm48sdfdf8bian9.jpg
 *              securePasswordUpdated: false
 *              rol: {
 *                 "uuid":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
 *                 "nombre": "Administrador"
 *              }
 */

/**
 * @swagger
 * tags:
 *  name: User
 *  description: Endpoints para el usuario
 */

/**
 * @swagger
 * /user:
 *  get:
 *      summary: Listado usuarios
 *      tags: [User]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *      responses:
 *          200:
 *              description: Retorna el listado de todos los usuarios registrados en el sistema
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/UserResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN])],
    userController.getAllUsers
);

/**
 * @swagger
 * /user/update-avatar/{id}:
 *  patch:
 *      summary: Permite actualizar el avatar de un usuario
 *      tags: [User]
 *      parameters:
 *          - $ref: '#/components/parameters/token'
 *          - in: path
 *            name: uuid
 *            schema:
 *              type: string
 *              format: uuid
 *            required: true
 *            description: El id del usuario
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
 *              description: El usuario con su avatar actualizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/UserResponse'
 *          500:
 *              description: Error de servidor
 *
 */
router.patch(
    "/update-avatar/:id",
    [validateJWT, param("id").exists(), validateFields],
    userController.patchUserAvatar
);

export default router;
