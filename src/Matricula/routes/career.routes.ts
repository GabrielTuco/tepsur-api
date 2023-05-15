import { Router } from "express";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { CareerController } from "../controllers/career.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { ROLES } from "../../interfaces/enums";
import { checkAuthRole } from "../../middlewares/checkAuthRole";

const router = Router();
const careerController = new CareerController();
/**
 * @swagger
 * components:
 *  schemas:
 *      Career:
 *          properties:
 *              id:
 *                  type: number
 *                  description : El id autogenerado de la secretaria
 *          required:
 *              - dni
 */

/**
 * @swagger
 * tags:
 *  name: Career
 *  description: Endpoints para las carreras
 */

router.get(
    "/find-by-uuid/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").exists(),
        validateFields,
    ],
    careerController.getCareerByUuid
);
router.get(
    "/find-by-Name/:name",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("name").exists(),
        validateFields,
    ],
    careerController.getCareerByName
);

router.get(
    "/modules/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").exists(),
        validateFields,
    ],
    careerController.getModulesOfCareer
);

/**
 * @swagger
 * /career:
 *  post:
 *      summary: Crea una nueva carrera
 *      tags: [Career]
 *      parameters:
 *          - $ref: '#/components/schemas/Token'
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Career'
 *      responses:
 *          200:
 *              description: La nueva carrera creada
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          $ref: '#/components/schemas/Career'
 *          500:
 *              description: Error de servidor
 *
 */
router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
        body("nombre").isString(),
        body("numModulos").isNumeric(),
        body("modulos").isArray(),
        body("modalidad").isString(),
        validateFields,
    ],
    careerController.postCareer
);

export default router;
