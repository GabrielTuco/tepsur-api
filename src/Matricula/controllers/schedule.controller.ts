import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";
import { DatabaseError } from "../../errors/DatabaseError";
import { adaptedSchedule } from "../adapters/schedule.adapter";
import { DatabaseErrorBase } from "../../errors/DatabaseErrorBase";
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) {}

    public postSchedule = async (req: Request, res: Response) => {
        try {
            const horario = await this.scheduleService.register(req.body);

            return res.json(horario);
        } catch (error: any) {
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
            const horarios = await this.scheduleService.listAll();

            return res.json(horarios);
        } catch (error) {
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
            const { id } = req.params;
            const horario = await this.scheduleService.findByUuid(id);

            return res.json(horario);
        } catch (error) {
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

    public getByCareer = async (req: Request, res: Response) => {
        try {
            const { uuid } = req.params;
            const horarios = await this.scheduleService.listPerCareer(uuid);
            return res.json(horarios);
        } catch (error) {
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

    public patchSchedule = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const horario = await this.scheduleService.update(
                id,
                adaptedSchedule(req.body)
            );

            return res.json(horario);
        } catch (error) {
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

    public deleteSchedule = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await this.scheduleService.delete(id);

            return res.json({ msg: "Ok" });
        } catch (error) {
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
