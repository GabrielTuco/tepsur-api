import { Request, Response } from "express";
import { TarifaPensionCarreraService } from "../services/tarifaPensionCarrera.service";

const tarifaService = new TarifaPensionCarreraService();

export class TarifaPensionCarreraController {
    public async POSTregister(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.register(req.body);

            return res.json(tarifa);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Internal server error" });
        }
    }

    public async GETall(_req: Request, res: Response) {
        try {
            const tarifas = await tarifaService.listAll();

            return res.json(tarifas);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Internal server error" });
        }
    }

    public async GEToneByUuid(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.findByUuid(req.params.uuid);

            return res.json(tarifa);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Internal server error" });
        }
    }

    public async GEToneByCarreraUuid(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.findByCarreraUuid(
                req.params.carreraUuid
            );

            return res.json(tarifa);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Internal server error" });
        }
    }

    public async PUTupdate(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.update(
                req.params.uuid,
                req.body
            );

            return res.json(tarifa);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Internal server error" });
        }
    }

    public async DELETEupdate(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.delete(req.params.uuid);

            return res.json(tarifa);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ msg: "Internal server error" });
        }
    }
}
