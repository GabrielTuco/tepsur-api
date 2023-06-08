import { Request, Response } from "express";
import { SedeRepository } from "../interfaces/sede.repository";
import { DatabaseError } from "../../errors/DatabaseError";
import { SedeService } from "../services/sede.service";

const sedeService = new SedeService();

export class SedeController {
    public async getAll(_req: Request, res: Response) {
        try {
            const sedes = await sedeService.listAll();

            return res.json(sedes);
        } catch (error: any) {
            console.log(error);
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
    public async getOneById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const sede = await sedeService.findById(id);

            return res.json(sede);
        } catch (error) {
            console.log(error);
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

    public async postSede(req: Request, res: Response) {
        try {
            const { nombre, direccion } = req.body;
            const createdSede = await sedeService.register({
                nombre,
                direccion,
            });

            return res.json(createdSede);
        } catch (error: any) {
            console.log(error);
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
