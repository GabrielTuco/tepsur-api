import { Router } from "express";
import { RoleController } from "../controllers/role.controller";

const router = Router();
const roleController = new RoleController();

/**
 * @swagger
 * components:
 *  schemas:
 *      Role:
 *          properties:
 *              id:
 *                  type: number
 *                  description : El id autogenerado del rol
 *              nombre:
 *                  type: string
 *                  description: Nombre del rol
 *              estado:
 *                  type: boolean
 *                  description: Estado del registro (Eliminacion logica)
 *              createdAt:
 *                  type: string
 *                  description: La fecha de creacion del registro
 *                  format: date-time
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  description: La fecha de actualizacion del registro
 *          required:
 *              - nombre
 *  parameters:
 *      codRol:
 *          in: path
 *          name: id
 *          required: true
 *          schema:
 *              type: number
 *          description: El codigo del rol
 */

/**
 * @swagger
 * tags:
 *  name: Roles
 *  description: Endpoints para los roles
 */

/**
 * @swagger
 * /role:
 *  get:
 *      summary: Retorna el listado de roles
 *      tags: [Roles]
 *      responses:
 *          200:
 *              description: El listado de roles
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                             $ref: '#/components/schemas/Role'
 *
 */
router.get("/", [], roleController.getRoles);

/**
 * @swagger
 * /role:
 *  post:
 *      summary: Crea un nuevo rol
 *      tags: [Roles]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Role'
 *      responses:
 *          200:
 *              description: El rol creado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Role'
 *          500:
 *              description: Error de servidor
 *
 */
router.post("/", [], roleController.postRole);

/**
 * @swagger
 * /role/{id}:
 *  put:
 *      summary: Actualizar un rol
 *      tags: [Roles]
 *      parameters:
 *          - $ref: '#/components/parameters/codRol'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Role'
 *      responses:
 *          200:
 *              description: El rol actualizado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Role'
 *          400:
 *              description: El mensaje de error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *          500:
 *              description: Error de servidor
 *
 */
router.put("/:id", [], roleController.putRole);

/**
 * @swagger
 * /role/{id}:
 *  delete:
 *      summary: Eliminar un rol
 *      tags: [Roles]
 *      parameters:
 *          - $ref: '#/components/parameters/codRol'
 *      responses:
 *          200:
 *              description: El rol eliminado
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Role'
 *          400:
 *              description: El mensaje de error
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                  type: string
 *          500:
 *              description: Error de servidor
 *
 */
router.delete("/:id", [], roleController.deleteRole);

export default router;
