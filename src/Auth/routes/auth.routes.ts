import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

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

router.get("/login", [], () => {});

//crear usuario para alumno
//router.post("/createStudentUser", [], postSecretaryUser);

//crear usuario para docente
//router.post("/createTeacherUser", [], postSecretaryUser);

export default router;
