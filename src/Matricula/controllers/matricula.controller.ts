import { Request, Response } from "express";
import { DatabaseError } from "../../errors/DatabaseError";
import fileUpload from "express-fileupload";
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

            return res.json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }
}
