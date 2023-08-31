import { Request, Response } from "express";
import { PensionService } from "../services/pension.service";
import { DatabaseError } from "../../errors/DatabaseError";
import fileUpload from "express-fileupload";
import { DatabaseErrorBase } from "../../errors/DatabaseErrorBase";

export class PensionController {
    constructor(private readonly pensionService: PensionService) {}

    public getByDni = async (req: Request, res: Response) => {
        try {
            const { dni } = req.params;
            const { alumno, pensiones } =
                await this.pensionService.listPensionByDni(dni);

            // const data = pensiones.filter((p) => p.pago_pensiones === null);

            return res.json({ alumno, pensiones });
        } catch (error) {
            console.log(error);
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

    public getBySede = async (req: Request, res: Response) => {
        try {
            const { year, month } = req.query;
            const pensiones = await this.pensionService.listPensionesBySede(
                year!.toString(),
                month?.toString()
            );

            return res.json(pensiones);
        } catch (error) {
            console.log(error);
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

    public getByUuid = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;

            const pension = await this.pensionService.findByUuid(uuid);

            return res.json(pension);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res
                    .status(error.codeStatus)
                    .json({ msg: error.message, name: error.name });
            }
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
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res
                    .status(error.codeStatus)
                    .json({ msg: error.message, name: error.name });
            }
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    };

    public getListPagos = async (_req: Request, res: Response) => {
        try {
            const pagos = await this.pensionService.listPagosHechos();

            return res.json(pagos);
        } catch (error) {
            console.log(error);
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

    public putUploadPaidDocument = async (req: Request, res: Response) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                res.status(400).json({ msg: "No hay imagen para subir." });
                return;
            }

            if (!req.files.image || Object.keys(req.files).length === 0) {
                res.status(400).json({
                    msg: "No hay imagen para subir (image).",
                });
                return;
            }
            await this.pensionService.uploadPaidDocument(
                req.params.uuid,
                req.files.image as fileUpload.UploadedFile
            );

            return res.json({
                msg: "Image uploaded",
            });
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    };

    public getPago = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const pago = await this.pensionService.findPago(uuid);

            return res.json(pago);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
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
