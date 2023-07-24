import { Router } from "express";
import { validateJWT } from "../../middlewares/validateJWT";
import { PensionController } from "../controllers/pension.controller";
import { PensionService } from "../services/pension.service";

const router = Router();
const pensionService = new PensionService();
const pensionController = new PensionController(pensionService);

router.get("/:dni", [validateJWT], pensionController.getByDni);

export default router;
