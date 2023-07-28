import { Request, Response } from "express";

import { SecretaryService } from "../services/secretary.service";
import { encryptPassword } from "../../helpers/encryptPassword";
import { DatabaseError } from "../../errors/DatabaseError";
import { adaptedSecretary } from "../adapters/secretary.adapter";

export class SecretaryController {
    constructor(private readonly secretaryService: SecretaryService) {}

    public postSecretary = async (req: Request, res: Response) => {
        try {
            //Registrar nueva secretaria
            const newSecretary = await this.secretaryService.register(req.body);
            if (!newSecretary) {
                return res.status(400).json({
                    msg: "No se pudo crear el registro",
                });
            }

            return res.json({
                secretary: newSecretary,
            });
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            res.status(500).json({
                message: "Internal server error",
            });
        }
    };

    public getSecretaries = async (_req: Request, res: Response) => {
        try {
            const secretaries = await this.secretaryService.listAll();

            return res.json(secretaries);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            res.status(500).json({
                message: "Internal server error",
            });
        }
    };

    public getSecretariesBySede = async (req: Request, res: Response) => {
        try {
            const { sede } = req.query;
            const secretaries = await this.secretaryService.listBySede(
                String(sede)
            );

            return res.json(secretaries);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            res.status(500).json({
                message: "Internal server error",
            });
        }
    };

    public patchSecretary = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const updatedSecretary = await this.secretaryService.update(
                id,
                adaptedSecretary(req.body)
            );
            if (!updatedSecretary) {
                return res.status(400).json({
                    msg: "No se pudo actualizar el registro",
                });
            }
            return res.json({
                updatedSecretary,
            });
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            res.status(500).json({
                message: "Internal server error, contact the administrator",
            });
        }
    };

    public deleteSecretary = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const secretary = await this.secretaryService.delete(uuid);
            return res.json(secretary);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            res.status(500).json({
                message: "Internal server error, contact the administrator",
            });
        }
    };
}
