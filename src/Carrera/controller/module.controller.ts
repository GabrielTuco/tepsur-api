import { Request, Response } from "express";
import { ModuleService } from "../service/module.service";
import { DatabaseError } from "../../errors/DatabaseError";

const moduleService = new ModuleService();

export class ModuleController {
    public async postModule(req: Request, res: Response) {
        try {
            const module = await moduleService.register(req.body);

            return res.json(module);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }

    public async getModuleByUuid(req: Request, res: Response) {
        try {
            const { uuid } = req.params;

            const module = await moduleService.findByUuid(uuid);

            return res.json(module);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }

    public async getModuleByName(req: Request, res: Response) {
        try {
            const { name } = req.params;

            const module = await moduleService.findByName(name);

            return res.json(module);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
}
