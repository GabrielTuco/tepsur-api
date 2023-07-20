import { Request, Response } from "express";
import { EspecializacionService } from "../services/especializacion.service";
import { DatabaseError } from "../../errors/DatabaseError";

export class EspecializacionController {
    constructor(
        private readonly especializacionService: EspecializacionService
    ) {}

    public getList = async (_req: Request, res: Response) => {
        try {
            const especializaciones =
                await this.especializacionService.listAll();

            return res.json(especializaciones);
        } catch (error) {
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
    public getOneByUuid = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const especializacion =
                await this.especializacionService.findByUuid(uuid);

            return res.json(especializacion);
        } catch (error) {
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
    public postEspecializacion = async (req: Request, res: Response) => {
        try {
            const especializacion = await this.especializacionService.register(
                req.body
            );

            return res.json(especializacion);
        } catch (error) {
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
    public putEspecializacion = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const { body } = req;
            const especializacion = await this.especializacionService.update(
                uuid,
                body
            );

            return res.json(especializacion);
        } catch (error) {
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
    public deleteEspecializacion = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const especializacion = await this.especializacionService.delete(
                uuid
            );
            return res.json(especializacion);
        } catch (error) {
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
