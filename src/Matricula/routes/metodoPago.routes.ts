import { Router } from "express";
import { MetodoPagoController } from "../controllers/metodoPago.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();
const metodoPagoController = new MetodoPagoController();

router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
        body("description", "La descricion es obligatoria").exists(),
        validateFields,
    ],
    metodoPagoController.postMetodoPago
);

router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ADMIN, ROLES.SECRE])],
    metodoPagoController.getAll
);

router.put(
    "/:id",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
        param("id").isUUID("4"),
        body("description", "La descricion es obligatoria").exists(),
        validateFields,
    ],
    metodoPagoController.putMetodoPago
);

export default router;
