import { Router } from "express";
import { CarreraController } from "./carrera.controller";

const router = Router();

const carreraController = new CarreraController();

router.post("/", [], carreraController.postCarrera);
router.get("/", [], carreraController.getCarreras);
router.get("/:id", [], carreraController.getCarrera);

export default router;
