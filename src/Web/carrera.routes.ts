import { Router } from "express";
import { CarreraController } from "./carrera.controller";

const router = Router();

const carreraController = new CarreraController();

router.get("/carrera/:id", [], carreraController.getCarrera);

export default router;
