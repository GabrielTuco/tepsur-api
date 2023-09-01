import { Request, Response } from "express";
import { UbigeoService } from "../services/ubigeo.service";

const ubigeoService = new UbigeoService();

export class UbigeoController {
    public async getDepartments(_req: Request, res: Response) {
        try {
            const departaments = await ubigeoService.listDepartaments();
            res.json(departaments);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async getProvinces(req: Request, res: Response) {
        try {
            const provinces = await ubigeoService.listProvinces(
                req.params.departamentoId
            );
            res.json(provinces);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async getDistricts(req: Request, res: Response) {
        try {
            const { departamentoId, provinciaId } = req.params;
            const districts = await ubigeoService.listDistricts(
                departamentoId,
                provinciaId
            );
            res.json(districts);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }
}
