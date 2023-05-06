import { Request, Response } from "express";
import { CareerService } from "../services/career.service";
import { DatabaseError } from "../../errors/DatabaseError";

const careerService = new CareerService();

export class CareerController {
    public async postCareer(req: Request, res: Response) {
        try {
            const career = await careerService.register(req.body);

            return res.json(career);
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

    public async getModulesOfCareer(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const modules = await careerService.listModules(uuid);

            return res.json(modules);
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

    public async getCareerByUuid(req: Request, res: Response) {
        try {
            const { uuid } = req.params;

            const career = await careerService.findByUuid(uuid);

            return res.json(career);
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

    public async getCareerByName(req: Request, res: Response) {
        try {
            const { name } = req.params;

            const career = await careerService.findByUuid(name);

            return res.json(career);
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
