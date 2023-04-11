import { Request, Response } from "express";
import { RoleService } from "../services/role.service";

const rolService = new RoleService();

export class RoleController {
    async getRoles(_req: Request, res: Response) {
        try {
            const roles = await rolService.listOfRoles();
            return res.json(roles);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: "contact the administrator",
            });
        }
    }

    async postRole(req: Request, res: Response) {
        try {
            const { nombre } = req.body;
            const newRole = await rolService.registerRole(nombre);
            if (!newRole) {
                return res
                    .status(400)
                    .json({ ok: false, msg: "role not created" });
            }
            return res.json(newRole);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: "contact the administrator",
            });
        }
    }

    async putRole(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { nombre } = req.body;

            const updatedRole = await rolService.updateRole(
                parseInt(id),
                nombre
            );
            if (!updatedRole) {
                return res.status(400).json({ msg: "role not found" });
            }
            return res.json(updatedRole);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: "contact the administrator",
            });
        }
    }

    async deleteRole(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const deletedRole = await rolService.deleteRole(parseInt(id));
            if (!deletedRole) {
                return res.status(400).json({ msg: "role not found" });
            }
            return res.json(deletedRole);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: "contact the administrator",
            });
        }
    }
}
