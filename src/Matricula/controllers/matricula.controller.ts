import { Request, Response } from "express";
import PDF from "pdfkit";
import fileUpload from "express-fileupload";
import { DatabaseError } from "../../errors/DatabaseError";
import { GradoEstudiosService } from "../services/gradoEstudios.service";
import { MatriculaService } from "../services/matricula.service";
import { ValidateDniService } from "../services/validateDNI.service";

const gradoEstudioService = new GradoEstudiosService();
const matriculaService = new MatriculaService();
const validateDniService = new ValidateDniService();

export class MatriculaController {
    constructor() {}

    public async postMatricula(req: Request, res: Response) {
        try {
            const matricula = await matriculaService.register(req.body);

            return res.json(matricula);
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
    }

    public async patchUploadPaidDocument(req: Request, res: Response) {
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
            await matriculaService.uploadPaidDocument(
                req.params.id,
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
    }

    public async postGradoEstudio(req: Request, res: Response) {
        try {
            const gradoEstudio = await gradoEstudioService.register(req.body);

            return res.json(gradoEstudio);
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
    }

    public async getValidateDniBasic(req: Request, res: Response) {
        try {
            const data = await validateDniService.validateDniBasic(
                req.params.dni
            );

            return res.json({
                tipoDocumento: data.tipoDocumento,
                numeroDocumento: data.numeroDocumento,
                nombre: data.nombre,
                apellidoPaterno: data.apellidoPaterno,
                apellidoMaterno: data.apellidoMaterno,
                nombres: data.nombres,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async getGradosEstudio(_req: Request, res: Response) {
        try {
            const gradosEstudio = await gradoEstudioService.getAll();
            return res.json(gradosEstudio);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async patchPagoMatricula(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pagoMatricula = await matriculaService.updatePagoMatricula(
                id,
                req.body
            );
            return res.json({
                matriculaUuid: id,
                pagoMatricula: pagoMatricula,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async getGeneratedPDF(req: Request, res: Response) {
        try {
            const doc = new PDF({ bufferPages: true });
            const fileName = "ArchivoPrueba.pdf";

            const stream = res.writeHead(200, {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=${fileName}`,
            });
            await matriculaService.generatePDF(req.params.id, doc, stream);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }
}
