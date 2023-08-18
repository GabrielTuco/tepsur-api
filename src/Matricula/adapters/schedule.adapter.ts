import { UpdateScheduleDTO } from "../dto/updateSchedule.dto";
import { Horario } from "../entity";

export const adaptedSchedule = (data: UpdateScheduleDTO): Partial<Horario> => {
    return {
        hora_inicio: data.horaInicio,
        hora_fin: data.horaFin,
        dias: data.dias,
        tipo: data.tipo,
    };
};
