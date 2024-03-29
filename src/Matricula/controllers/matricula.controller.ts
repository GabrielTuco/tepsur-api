import { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { GradoEstudiosService } from "../services/gradoEstudios.service";
import { MatriculaService } from "../services/matricula.service";
import { ValidateDniService } from "../services/validateDNI.service";
import { generatePDF } from "../helpers/generatePDF";
import yargs from "yargs";
import { Alumno } from "../../Student/entity";
import { Matricula } from "../entity";
import { MatriculaEspecilizacionService } from "../../Especializacion/services/matriculaEspecializacion.service";
import { DatabaseErrorBase } from "../../errors/DatabaseErrorBase";
import { formatDate, getDateFormatWH } from "../helpers/formatDate";

const gradoEstudioService = new GradoEstudiosService();
const matriculaService = new MatriculaService();
const validateDniService = new ValidateDniService();
const matriculaEspeService = new MatriculaEspecilizacionService();
export class MatriculaController {
    public async postMatricula(req: Request, res: Response) {
        try {
            const matricula = await matriculaService.register(req.body);
            const {
                matriculaModulosModulo,
                matriculaGruposGrupo,
                ...matriculaData
            } = matricula;
            return res.json(matriculaData);
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
    }

    public async postImportarMatricula(req: Request, res: Response) {
        try {
            const matricula = await matriculaService.importarMatriculaExistente(
                req.body
            );
            return res.json(matricula);
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
    }

    public async putSetModulesToMatricula(req: Request, res: Response) {
        try {
            const { matriculaUuid } = req.params;
            const { modulosMatricula } = req.body;

            const matriculaWithNewModules =
                await matriculaService.setModulesForMatricula(
                    matriculaUuid,
                    modulosMatricula
                );

            return res.json(matriculaWithNewModules);
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
    }

    public async postGradoEstudio(req: Request, res: Response) {
        try {
            const gradoEstudio = await gradoEstudioService.register(req.body);

            return res.json(gradoEstudio);
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
    }

    public async getList(req: Request, res: Response) {
        try {
            const { year, month } = req.query;
            const matriculas = await matriculaService.getAll(
                year?.toString(),
                month?.toString()
            );

            return res.json(matriculas);
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
    }

    public async getValidateDniBasic(req: Request, res: Response) {
        try {
            const data = await validateDniService.validateDniBasic(
                req.params.dni
            );

            if (data instanceof Alumno) {
                return res.json(data);
            }
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

    public async getGenerateFichaMatricula(req: Request, res: Response) {
        try {
            const { id } = req.params;
            let matricula: Matricula | null;
            matricula = await matriculaService.matriculaDataForPDF(id);
            if (!matricula) {
                const data = await matriculaEspeService.findByUuid(id);
                return res.render("matriculaEspecializacion", {
                    ...data,
                    fecha_inscripcion: getDateFormatWH(data.fecha_inscripcion),
                });
            } else {
                return res.render("matricula", {
                    ...matricula,
                    fecha_inscripcion: getDateFormatWH(
                        matricula.fecha_inscripcion
                    ),
                });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async getGenerateFichaMatriculaPDF(req: Request, res: Response) {
        try {
            let host: string;
            const argv = yargs(process.argv.slice(2))
                .options({
                    develop: { type: "boolean" },
                })
                .parseSync();

            if (!!argv.develop) host = "http://localhost:5000/api";
            else host = "https://plataformatepsur.up.railway.app/api";

            const url = `${host}/matricula/generate-ficha/${req.params.id}`;
            const pdfBuffer = await generatePDF({ url });
            return res
                .status(200)
                .set({
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                })
                .end(pdfBuffer);
        } catch (error) {
            console.log(error);
        }
    }

    public async getModules(_req: Request, res: Response) {
        try {
            const modules = await matriculaService.listModules();
            return res.json(modules);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async getFindByQuery(req: Request, res: Response) {
        try {
            const { query } = req.query;
            const matriculas = await matriculaService.findByQuery(
                String(query)
            );

            const data = matriculas.map((m) => ({
                uuid: m.matricula.uuid,
                dni: m.matricula.alumno.dni,
                nombres: m.matricula.alumno.nombres,
                ape_paterno: m.matricula.alumno.ape_paterno,
                ape_materno: m.matricula.alumno.ape_materno,
                pago_matricula: m.matricula.pagoMatricula,
                carrera: m.matricula.carrera,
                ultimo_grupo: m.matricula.ultimo_grupo,
                ultimo_pago: m.ultimoPago,
            }));
            return res.json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async getFindByUuid(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const data = await matriculaService.findByUuid(uuid);
            return res.json(data);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: "Internal server error",
            });
        }
    }

    public async putUpdateMatricula(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const { body } = req;

            const matricula = await matriculaService.update(uuid, body);

            return res.json(matricula);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({ msg: "Internal server error" });
        }
    }
}
