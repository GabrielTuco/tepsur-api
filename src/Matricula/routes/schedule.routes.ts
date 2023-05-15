import { Router } from "express";
import { ScheduleController } from "../controllers/schedule.controller";
import { validateJWT } from "../../middlewares/validateJWT";
import { checkAuthRole } from "../../middlewares/checkAuthRole";
import { ROLES } from "../../interfaces/enums";
import { body } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";

const router = Router();
const scheduleController = new ScheduleController();

router.post(
    "/",
    [
        validateJWT,
        checkAuthRole([ROLES.ADMIN]),
        body(["turno", "dias"], "Este campo es obligatorio").isString(),
        body(["horaInicio", "horaFin"], "Debe ser un numero").isNumeric(),
        validateFields,
    ],
    scheduleController.postSchedule
);

router.get(
    "/",
    [validateJWT, checkAuthRole([ROLES.ADMIN])],
    scheduleController.getAll
);

router.get(
    "/:id",
    [validateJWT, checkAuthRole([ROLES.ADMIN])],
    scheduleController.getByUuid
);

router.patch(
    "/:id",
    [validateJWT, checkAuthRole([ROLES.ADMIN])],
    scheduleController.patchSchedule
);

router.delete(
    "/:id",
    [validateJWT, checkAuthRole([ROLES.ADMIN])],
    scheduleController.deleteSchedule
);

export default router;
