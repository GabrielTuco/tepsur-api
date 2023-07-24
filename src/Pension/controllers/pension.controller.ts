import { Request, Response } from "express";
import { PensionService } from "../services/pension.service";

export class PensionController {
    constructor(private readonly pensionService: PensionService) {}

    public getByDni = async (req: Request, res: Response) => {
        try {
            const { dni } = req.params;
            const { alumno, pensiones } =
                await this.pensionService.listPensionByDni(dni);

            const data = pensiones.filter((p) => p.pago_pension === null);

            return res.json({ alumno, pensiones: data });
        } catch (error) {
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    };
}
