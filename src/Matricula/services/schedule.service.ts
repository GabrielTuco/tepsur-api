import { v4 as uuid } from "uuid";
import { Horario } from "../entity";
import { ScheduleDTO } from "../interfaces/dtos";
import { ScheduleRepository } from "../interfaces/repositories";
import { DatabaseError } from "../../errors/DatabaseError";

export class ScheduleService implements ScheduleRepository {
    public async register(data: ScheduleDTO): Promise<Horario> {
        try {
            const newHorario = new Horario();

            newHorario.uuid = uuid();
            newHorario.turno = data.turno;
            newHorario.dias = data.dias;
            newHorario.hora_inicio = data.horaInicio;
            newHorario.hora_fin = data.horaFin;

            return await newHorario.save();
        } catch (error) {
            throw error;
        }
    }
    public async listAll(): Promise<Horario[]> {
        try {
            const horarios = await Horario.find();

            return horarios;
        } catch (error) {
            throw error;
        }
    }
    public async findByUuid(uuid: string): Promise<Horario> {
        try {
            const horario = await Horario.findOneBy({ uuid });
            if (!horario) throw new DatabaseError("Horario not found", 404, "");

            return horario;
        } catch (error) {
            throw error;
        }
    }

    public async update(
        uuid: string,
        data: Partial<Horario>
    ): Promise<Horario> {
        try {
            const horario = await Horario.findOneBy({ uuid });
            if (!horario) throw new DatabaseError("Horario not found", 404, "");

            Object.assign(horario, data);

            await horario.save();
            await horario.reload();

            return horario;
        } catch (error) {
            throw error;
        }
    }

    public async delete(uuid: string): Promise<void> {
        try {
            const horario = await Horario.findOneBy({ uuid });
            if (!horario) throw new DatabaseError("Horario not found", 404, "");
            horario.estado = false;
            await horario.save();
            return;
        } catch (error) {
            throw error;
        }
    }
}
