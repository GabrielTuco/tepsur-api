import { Router } from "express";
import { SedeController } from "../controllers/sede.controller";

const router = Router();

const sedeController = new SedeController();

router.get("/", [], sedeController.getAll);
router.get("/:id", [], sedeController.getOneById);
router.post("/", [], sedeController.postSede);

export default router;
