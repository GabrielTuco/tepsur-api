import { Router } from "express";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";
import { CareerController } from "../controllers/career.controller";

const router = Router();
const careerController = new CareerController();

router.get(
    "/findUuid/:uuid",
    [param("uuid").exists(), validateFields],
    careerController.getCareerByUuid
);
router.get(
    "/findName/:name",
    [param("name").exists(), validateFields],
    careerController.getCareerByName
);

router.get(
    "/modules/:uuid",
    [param("uuid").exists(), validateFields],
    careerController.getModulesOfCareer
);

router.post(
    "/",
    [
        body("nombre").isString(),
        body("numModulos").isNumeric(),
        body("modulosUuids").isArray(),
        validateFields,
    ],
    careerController.postCareer
);

export default router;
