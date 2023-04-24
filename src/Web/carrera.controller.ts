import { Request, Response } from "express";
import { DatabaseError } from "../errors/DatabaseError";
import { CarreraService } from "./carrera.service";

const carreraService = new CarreraService();

export class CarreraController {
    public async getCarrera(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const carrera = await carreraService.findById(parseInt(id));

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
}
