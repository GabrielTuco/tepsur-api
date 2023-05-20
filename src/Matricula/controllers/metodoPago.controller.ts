import { Request, Response } from "express";
import { MetodoPagoRepository } from "../interfaces/repositories";
import { MetodoPagoService } from "../services/metodoPago.service";

const metodoPagoService = new MetodoPagoService();

export class MetodoPagoController {
    public async postMetodoPago(req: Request, res: Response) {
        try {
            const metodoPago = await metodoPagoService.register(
                req.body.description
            );
            return res.json(metodoPago);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Interval server error",
            });
        }
    }

    public async getAll(_req: Request, res: Response) {
        try {
            const metodosPago = await metodoPagoService.getAll();
            return res.json(metodosPago);
        } catch (error) {
            return res.status(500).json({
                msg: "Interval server error",
            });
        }
    }
    public async putMetodoPago(req: Request, res: Response) {
        try {
            const metodoPagoUpdated = await metodoPagoService.update(
                req.params.id,
                req.body.description
            );
            return res.json(metodoPagoUpdated);
        } catch (error) {
            return res.status(500).json({
                msg: "Interval server error",
            });
        }
    }
}
