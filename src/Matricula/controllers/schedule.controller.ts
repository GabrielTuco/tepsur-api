import { Request, Response } from "express";
import { ScheduleService } from "../services/schedule.service";
import { DatabaseError } from "../../errors/DatabaseError";
import { adaptedSchedule } from "../adapters/schedule.adapter";

const scheduleService = new ScheduleService();

export class ScheduleController {
    public async postSchedule(req: Request, res: Response) {
        try {
            const horario = await scheduleService.register(req.body);

            return res.json(horario);
        } catch (error: any) {
            if (error instanceof DatabaseError) {
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

    public async getAll(_req: Request, res: Response) {
        try {
            const horarios = await scheduleService.listAll();

            return res.json(horarios);
        } catch (error) {
            if (error instanceof DatabaseError) {
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

    public async getByUuid(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const horario = scheduleService.findByUuid(id);

            return res.json(horario);
        } catch (error) {
            if (error instanceof DatabaseError) {
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

    public async patchSchedule(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const horario = await scheduleService.update(
                id,
                adaptedSchedule(req.body)
            );

            return res.json(horario);
        } catch (error) {
            if (error instanceof DatabaseError) {
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

    public async deleteSchedule(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await scheduleService.delete(id);

            return res.json({ msg: "Ok" });
        } catch (error) {
            if (error instanceof DatabaseError) {
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
