import { v4 as uuid } from "uuid";
import { Carrera, Grupo, Horario } from "../entity";
import { ScheduleDTO } from "../interfaces/dtos";
import { ScheduleRepository } from "../interfaces/repositories";
import { DatabaseError } from "../../errors/DatabaseError";
import { NotFoundError } from "../../errors/NotFoundError";

export class ScheduleService implements ScheduleRepository {
    public register = async (data: ScheduleDTO): Promise<Horario> => {
        try {
            const newHorario = new Horario();

            newHorario.uuid = uuid();
            newHorario.dias = data.dias;
            newHorario.hora_inicio = data.horaInicio;
            newHorario.hora_fin = data.horaFin;

            return await newHorario.save();
        } catch (error) {
            throw error;
        }
    };

    public listAll = async (): Promise<Horario[]> => {
        try {
            const horarios = await Horario.find({ where: { estado: true } });

            return horarios;
        } catch (error) {
            throw error;
        }
    };

    public listBySecretary = async (
        secretariaUuid: string
    ): Promise<Horario[]> => {
        try {
            const grupos = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.horario", "h")
                .innerJoinAndSelect("g.secretaria", "s")
                .where("s.uuid=:secretariaUuid", { secretariaUuid })
                .getMany();

            const horarios = grupos.map((g) => g.horario);

            return horarios;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<Horario> => {
        try {
            const horario = await Horario.findOneBy({ uuid });
            if (!horario) throw new NotFoundError("El horario no existe");

            return horario;
        } catch (error) {
            throw error;
        }
    };

    public update = async (
        uuid: string,
        data: Partial<Horario>
    ): Promise<Horario> => {
        try {
            console.log(uuid);
            const horario = await Horario.findOneBy({ uuid });
            if (!horario) throw new NotFoundError("El horario no existe");

            await Horario.update({ uuid }, data);

            await horario.reload();
            return horario;
        } catch (error) {
            throw error;
        }
    };

    public delete = async (uuid: string): Promise<Horario> => {
        try {
            const horario = await Horario.findOneBy({ uuid });
            if (!horario) throw new NotFoundError("El horario no existe");
            horario.estado = false;
            await horario.save();
            await horario.reload();
            return horario;
        } catch (error) {
            throw error;
        }
    };

    public listPerCareer = async (carreraUuid: string): Promise<Horario[]> => {
        try {
            const grupos = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.carrera", "c")
                .innerJoinAndSelect("g.horario", "h")
                .where("c.uuid=:carreraUuid", { carreraUuid })
                .getMany();

            const horarios = grupos.map((m) => m.horario);

            return horarios;
        } catch (error) {
            throw error;
        }
    };
}
