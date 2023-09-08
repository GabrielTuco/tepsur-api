import { Request, Response } from "express";
import { CertificadoService } from "../service/certificado.service";
import { UploadedFile } from "express-fileupload";
import { DatabaseErrorBase } from "../../errors/DatabaseErrorBase";

export class CertificadoController {
    constructor(private readonly certificadoService: CertificadoService) {}

    public postCertificado = async (req: Request, res: Response) => {
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
            const image = req.files.image as UploadedFile;
            const { descripcion, matriculaUuid } = req.body;

            const certificado = await this.certificadoService.register({
                descripcion,
                matriculaUuid,
                image,
            });
            return res.json(certificado);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
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

    public getByUuid = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const certificado = await this.certificadoService.findByUuid(uuid);

            res.json(certificado);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
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

    public getByMatricula = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const certificados = await this.certificadoService.listByMatricula(
                uuid
            );

            res.json(certificados);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
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

    public getAll = async (_req: Request, res: Response) => {
        try {
            const certificados = await this.certificadoService.listAll();

            res.json(certificados);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
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

    public deleteCertificado = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const certificadoDeleted = await this.certificadoService.delete(
                uuid
            );

            return res.json({ uuid: certificadoDeleted });
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
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
}
