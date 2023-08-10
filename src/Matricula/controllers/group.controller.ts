import { Request, Response } from "express";
import { GroupService } from "../services/group.service";
import { DatabaseError } from "../../errors/DatabaseError";
import { DatabaseErrorBase } from "../../errors/DatabaseErrorBase";

const groupService = new GroupService();

export class GroupController {
    public async postGroup(req: Request, res: Response) {
        try {
            const grupo = await groupService.register(req.body);

            return res.json(grupo);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }

    public async patchAddStudent(req: Request, res: Response) {
        try {
            const { matriculasUuid, grupoUuid, secretariaUuid } = req.body;
            const grupo = await groupService.addStudent(
                matriculasUuid,
                grupoUuid,
                secretariaUuid
            );

            return res.json(grupo);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }

    public async getAll(_req: Request, res: Response) {
        try {
            const grupos = await groupService.listGroups();
            return res.json(grupos);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }

    public async getAllBySecretary(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const grupos = await groupService.listGroupsBySecretary(uuid);
            return res.json(grupos);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }

    public async getAllBySede(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const grupos = await groupService.listGroupsBySede(uuid);
            return res.json(grupos);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }

    public async getStudents(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const students = await groupService.listEstudents(id);

            return res.json(students);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }

    public async getByUuid(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const grupo = await groupService.findByUuid(id);
            return res.json(grupo);
        } catch (error) {
            console.log(error);
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }
    public async getByName(req: Request, res: Response) {
        try {
            const { name } = req.params;
            const grupo = await groupService.findByName(name);

            return res.json(grupo);
        } catch (error) {
            if (error instanceof DatabaseError) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }

    public async putCloseGroup(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const grupo = await groupService.closeGroup(uuid);

            return res.json(grupo);
        } catch (error) {
            if (error instanceof DatabaseErrorBase) {
                return res.status(error.codeStatus).json({
                    msg: error.message,
                    name: error.name,
                });
            }
            return res.status(500).json({
                msg: "Internal Server Error, contact the administrator",
            });
        }
    }
}
