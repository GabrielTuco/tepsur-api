import { Horario } from "../entity";
import { UpdateScheduleDTO } from "../interfaces/dtos";

export const adaptedSchedule = (data: UpdateScheduleDTO): Partial<Horario> => {
    return {
        hora_inicio: data.horaInicio,
        hora_fin: data.horaFin,
        dias: data.dias,
    };
};
