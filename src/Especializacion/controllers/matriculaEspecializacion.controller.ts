import { Request, Response } from "express";
import { MatriculaEspecilizacionService } from "../services/matriculaEspecializacion.service";
import { DatabaseError } from "../../errors/DatabaseError";

export class MatriculaEspecializacionController {
    constructor(
        private readonly matriculaEspeService: MatriculaEspecilizacionService
    ) {}

    public postMatricula = async (req: Request, res: Response) => {
        try {
            const matricula = await this.matriculaEspeService.register(
                req.body
            );

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
    };

    public getList = async (_req: Request, res: Response) => {
        try {
            const matriculas = await this.matriculaEspeService.listAll();

            return res.json(matriculas);
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
    public getOne = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const matricula = await this.matriculaEspeService.findByUuid(uuid);

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
    };
    public update = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const data = req.body;
            const matricula = await this.matriculaEspeService.update(
                uuid,
                data
            );

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
    };
    public delete = async (_req: Request, res: Response) => {
        try {
            return res.json("Not implemented");
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
}
