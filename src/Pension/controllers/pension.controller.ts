import { Request, Response } from "express";
import { PensionService } from "../services/pension.service";
import { DatabaseError } from "../../errors/DatabaseError";

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
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    };

    public postPagoPension = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const body = req.body;
            const pagoPension = await this.pensionService.pagarPension(
                uuid,
                body
            );

            return res.json(pagoPension);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res
                    .status(error.codeStatus)
                    .json({ msg: error.message, name: error.name });
            }
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    };
}
