import { Request, Response } from "express";
import { AdministratorService } from "../service/admin.service";
import { DatabaseErrorBase } from "../../errors/DatabaseErrorBase";

export class AdministratorController {
    constructor(private readonly administratorService: AdministratorService) {}
    public postAdmin = async (req: Request, res: Response) => {
        try {
            const data = req.body;
            const admnistrador = await this.administratorService.register(data);

            return res.json(admnistrador);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    };

    public getAll = async (_req: Request, res: Response) => {
        try {
            const admin = await this.administratorService.listAll();

            return res.json(admin);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    };

    public getByUuid = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const admin = await this.administratorService.searchByUuid(uuid);

            return res.json(admin);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    };

    public putAdmin = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const data = req.body;
            const admin = this.administratorService.updateAdmin(uuid, data);
            return res.json(admin);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    };

    public deleteAdmin = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const admin = this.administratorService.deleteAdmin(uuid);
            return res.json(admin);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    };
}
