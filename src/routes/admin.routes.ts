import { Router } from "express";
import { AdministratorController } from "../controllers/admin.controller";
import { body } from "express-validator";
import { validateFields } from "../middlewares/validateFields";

const router = Router();
const adminController = new AdministratorController();

router.post(
    "/",
    [
        body("dni").isLength({ min: 8, max: 8 }),
        body("nombres").isString(),
        body("apePaterno").isString(),
        body("apeMaterno").isString(),
        validateFields,
    ],
    adminController.postAdministrator
);

export default router;
