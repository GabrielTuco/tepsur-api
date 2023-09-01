import { Router } from "express";
import { UbigeoController } from "../controllers/ubigeo.controller";
import { validateJWT } from "../middlewares/validateJWT";
import { param } from "express-validator";
import { validateFields } from "../middlewares/validateFields";

const router = Router();
const ubigeoController = new UbigeoController();

/**
 * @swagger
 * tags:
 *  name: Utilidades
 *  description: Endpoints para las utilidades
 */

/**
 * @swagger
 * /utilidades/departamentos:
 *  get:
 *      summary: Listado de departamentos del peru
 *      tags: [Utilidades]
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
router.get("/departamentos", [validateJWT], ubigeoController.getDepartments);

/**
 * @swagger
 * /utilidades/provincias/{departamentoId}:
 *  get:
 *      summary: Listado de provincias de un departamento
 *      tags: [Utilidades]
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
    "/provincias/:departamentoId",
    [validateJWT, param("departamentoId").exists(), validateFields],
    ubigeoController.getProvinces
);

/**
 * @swagger
 * /utilidades/distritos/{departamentoId}/{provinciaId}:
 *  get:
 *      summary: Listado de distritos de un departamento
 *      tags: [Utilidades]
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
    "/distritos/:departamentoId/:provinciaId",
    [
        validateJWT,
        param("departamentoId").exists(),
        param("provinciaId").exists(),
        validateFields,
    ],
    ubigeoController.getDistricts
);

export default router;
