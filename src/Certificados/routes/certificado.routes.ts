import { Router } from "express";
import { body, param } from "express-validator";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { CertificadoService } from "../service/certificado.service";
import { CertificadoController } from "../controller/certificado.controller";
import { ROLES } from "../../interfaces/enums";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();

const certificadoService = new CertificadoService();
const certificadoController = new CertificadoController(certificadoService);

router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        body("descripcion").isString(),
        body("matriculaUuid").isUUID(4),
        // body("image").exists(),
        validateFields,
    ],
    certificadoController.postCertificado
);

router.get(
    "/:uuid",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    certificadoController.getByUuid
);
router.get(
    "/matricula/:uuid",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    certificadoController.getByMatricula
);
router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE])],
    certificadoController.getAll
);

router.delete(
    "/:uuid",
    [
        validateJWT,
        checkAuthRole([ROLES.ROOT, ROLES.ADMIN, ROLES.SECRE]),
        param("uuid").isUUID(4),
        validateFields,
    ],
    certificadoController.deleteCertificado
);

export default router;