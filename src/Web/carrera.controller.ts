import { Request, Response } from "express";
import { DatabaseError } from "../errors/DatabaseError";
import { CarreraService } from "./carrera.service";

const carreraService = new CarreraService();

export class CarreraController {
    public async postCarrera(req: Request, res: Response) {
        try {
            const data = await carreraService.register(req.body);

            return res.json(data);
        } catch (error) {
            return res.status(500).json({
                msg: "Contact the administrator",
            });
        }
    }

    public async getCarrera(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const carrera = await carreraService.findByUuid(id);

            return res.json(carrera);
        } catch (error: any) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    errName: error.name,
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }

    public async getCarreras(_req: Request, res: Response) {
        try {
            const carreras = await carreraService.listAll();

            return res.json(carreras);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    errName: error.name,
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
}