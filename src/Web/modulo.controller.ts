import { Request, Response } from "express";
import { DatabaseError } from "../errors/DatabaseError";
import { ModuloService } from "./modulo.service";
import { ModuloDTO } from "./interfaces/dtos";

const moduloService = new ModuloService();

export class ModuloController {
    public async postModulo(req: Request, res: Response) {
        try {
            // const {nombre, descripcion, urlVideo, images} = req.body as ModuloDTO

            const moduloCreated = await moduloService.register(req.body);

            return res.json(moduloCreated);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    name: error.name,
                    msg: error.message,
                });
            }
            return res.status(500).json({
                mgs: "contact the administrator",
            });
        }
    }

     public async getModulo(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const modulo = await moduloService.findByUuid(id);

            return res.json(modulo);
        } catch (error: any) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    errName: error.name,
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
    
    public async getModulos(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const modulos = await moduloService.findAll();

            return res.json(modulos);
        } catch (error: any) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    errName: error.name,
                    msg: error.message,
                });
            }
            return res.status(500).json({
                msg: "contact the administrator",
            });
        }
    }
}
