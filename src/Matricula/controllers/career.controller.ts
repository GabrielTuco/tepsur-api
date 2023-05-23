import { Request, Response } from "express";
import { CareerService } from "../services/career.service";
import { DatabaseError } from "../../errors/DatabaseError";

const careerService = new CareerService();

export class CareerController {
    public async getCareers(_req: Request, res: Response) {
        try {
            const carreras = await careerService.listAll();
            return res.json(carreras);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error",
            });
        }
    }

    public async postCareer(req: Request, res: Response) {
        try {
            const career = await careerService.register(req.body);

            return res.json(career);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error",
            });
        }
    }

    public async getModulesOfCareer(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const modules = await careerService.listModules(uuid);

            return res.json(modules);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error",
            });
        }
    }

    public async getCareerByUuid(req: Request, res: Response) {
        try {
            const { uuid } = req.params;

            const career = await careerService.findByUuid(uuid);

            return res.json(career);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error",
            });
        }
    }

    public async getCareerByName(req: Request, res: Response) {
        try {
            const { name } = req.params;

            const career = await careerService.findByUuid(name);

            return res.json(career);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error",
            });
        }
    }
}
