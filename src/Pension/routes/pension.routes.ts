import { Router } from "express";
import { validateJWT } from "../../middlewares/validateJWT";
import { PensionController } from "../controllers/pension.controller";
import { PensionService } from "../services/pension.service";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();
const pensionService = new PensionService();
const pensionController = new PensionController(pensionService);

router.get("/:dni", [validateJWT], pensionController.getByDni);

router.post("/pagar/:uuid", [
    validateJWT,
    checkAuthRole([ROLES.ADMIN, ROLES.SECRE]),
    param("uuid").isUUID(4),
    body("formaPagoUuid").isUUID(4),
    body(["fecha", "numComprobante", "entidadBancaria"]).isString(),
    validateFields,
]);

export default router;
