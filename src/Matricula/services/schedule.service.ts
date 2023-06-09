import { v4 as uuid } from "uuid";
import { Carrera, Horario } from "../entity";
import { ScheduleDTO } from "../interfaces/dtos";
import { ScheduleRepository } from "../interfaces/repositories";
import { DatabaseError } from "../../errors/DatabaseError";

export class ScheduleService implements ScheduleRepository {
    public async register(data: ScheduleDTO): Promise<Horario> {
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
            console.log(uuid);
            const horario = await Horario.findOneBy({ uuid });
            if (!horario) throw new DatabaseError("Horario not found", 404, "");

            await Horario.update({ uuid }, data);

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

    public async removeFromCareer(
        carreraUuid: string,
        horarioUuid: string
    ): Promise<Carrera> {
        try {
            //TODO validar que no hay grupos vinculados al horario caso contrario cancelar

            const carrera = await Carrera.createQueryBuilder("c")
                .innerJoinAndSelect("c.horarios", "h")
                .where("c.uuid=:uuid", { uuid: carreraUuid })
                .getOne();

            if (!carrera)
                throw new DatabaseError(
                    "Carrera not found",
                    500,
                    "Database found error"
                );

            const horarioInCarrera = carrera.horarios.find(
                (h) => h.uuid === horarioUuid
            );

            if (!horarioInCarrera)
                throw new DatabaseError(
                    "Este horario no pertenece a esta carrera",
                    500,
                    "Database found error"
                );

            carrera.horarios = carrera.horarios.filter(
                (h) => h.uuid !== horarioUuid
            );

            await carrera.save();
            await carrera.reload();

            return carrera;
        } catch (error) {
            throw error;
        }
    }
}
