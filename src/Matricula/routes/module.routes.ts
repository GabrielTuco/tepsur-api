import { Router } from "express";
import { ModuleController } from "../controllers/module.controller";
import { body, param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();
const moduleController = new ModuleController();

router.get(
    "/findUuid/:uuid",
    [param("uuid").exists(), validateFields],
    moduleController.getModuleByUuid
);
router.get(
    "/findName/:name",
    [param("name").exists(), validateFields],
    moduleController.getModuleByUuid
);

router.post(
    "/",
    [body("nombre").exists(), body("duracionSemanas").exists(), validateFields],
    moduleController.postModule
);

export default router;
