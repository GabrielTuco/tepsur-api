import { Pension } from "../entity/Pension.entity";
import { RegisterPensionDTO } from "./dtos";

export interface PensionRepository {
    register(data: RegisterPensionDTO): Promise<Pension>;
    listPensionByMatricula(matriculaUuid: string): Promise<Pension[]>;
    findByUuid(uuid: string): Promise<Pension>;
    updateFechaLimite(uuid: string, fecha: Date): Promise<Pension>;
}
