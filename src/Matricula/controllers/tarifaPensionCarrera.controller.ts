import { Request, Response } from "express";
import { TarifaPensionCarreraService } from "../services/tarifaPensionCarrera.service";
import { DatabaseErrorBase } from "../../errors/DatabaseErrorBase";

const tarifaService = new TarifaPensionCarreraService();

export class TarifaPensionCarreraController {
    public async POSTregister(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.register(req.body);

            return res.json(tarifa);
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
    }

    public async GETall(_req: Request, res: Response) {
        try {
            const tarifas = await tarifaService.listAll();

            return res.json(tarifas);
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
    }

    public async GETallBySede(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const tarifas = await tarifaService.listBySede(uuid);

            return res.json(tarifas);
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
    }

    public async GEToneByUuid(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.findByUuid(req.params.uuid);

            return res.json(tarifa);
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
    }

    public async GEToneByCarreraUuid(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.findByCarreraUuid(
                req.params.carreraUuid
            );

            return res.json(tarifa);
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
    }

    public async PUTupdate(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.update(
                req.params.uuid,
                req.body
            );

            return res.json(tarifa);
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
    }

    public async DELETEdelete(req: Request, res: Response) {
        try {
            const tarifa = await tarifaService.delete(req.params.uuid);

            return res.json(tarifa);
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
    }
}
