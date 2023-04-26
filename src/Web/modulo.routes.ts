import { Router } from "express";
import { body } from "express-validator";
import { validateFields } from "../middlewares/validateFields";
import { ModuloController } from "./modulo.controller";

const router = Router();
const moduloController = new ModuloController();

router.post(
    "/",
    [body("nombre").exists(), body("descripcion").exists(), validateFields],
    moduloController.postModulo
);

router.get("/:id", [], moduloController.getModulo);

router.get("/", [], moduloController.getModulos);

export default router;
