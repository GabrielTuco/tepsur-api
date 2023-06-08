import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { validateJWT } from "../../middlewares/validateJWT";

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
 *          example:
 *              id: 16
 *              usuario: Test
 *              avatar: https://res.cloudinary.com/dvoo0vvff/image/upload/v1684428107/tepsur/user-avatars/tm48sdfdf8bian9.jpg
 */

/**
 * @swagger
 * tags:
 *  name: User
 *  description: Endpoints para el usuario
 */

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
