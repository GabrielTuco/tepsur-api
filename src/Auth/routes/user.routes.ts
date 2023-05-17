import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { param } from "express-validator";
import { validateFields } from "../../middlewares/validateFields";


const router = Router();
const userController = new UserController()

router.patch("/update-avatar/:id",[
    param("id").exists(),
    validateFields
],userController.patchUserAvatar);

export default router;