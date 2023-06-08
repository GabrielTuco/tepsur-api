import { v4 as uuid } from "uuid";
import { Pension } from "../entity/Pension.entity";
import { RegisterPensionDTO } from "../interfaces/dtos";
import { PensionRepository } from "../interfaces/repositories";
import { DatabaseError } from "../../errors/DatabaseError";

export class PensionService implements PensionRepository {
    public async register(data: RegisterPensionDTO): Promise<Pension> {
        try {
            const newPension = new Pension();

            newPension.uuid = uuid();
            newPension.matricula = data.matricula;
            newPension.mes = data.mes;
            newPension.fecha_limite = data.fechaLimite;
            newPension.monto = data.monto;

            await newPension.save();

            return newPension;
        } catch (error) {
            throw error;
        }
    }
    public async listPensionByMatricula(
        matriculaUuid: string
    ): Promise<Pension[]> {
        try {
            const pensiones = await Pension.createQueryBuilder("p")
                .innerJoinAndSelect("p.matricula", "m")
                .where("m.uuid=:uuid", { uuid: matriculaUuid })
                .getMany();

            return pensiones;
        } catch (error) {
            throw error;
        }
    }
    public async findByUuid(uuid: string): Promise<Pension> {
        try {
            const pension = await Pension.findOneBy({ uuid });
            if (!pension)
                throw new DatabaseError(
                    "Pension not found",
                    500,
                    "Database Error"
                );

            return pension;
        } catch (error) {
            throw error;
        }
    }
    public async updateFechaLimite(
        uuid: string,
        fecha: Date
    ): Promise<Pension> {
        try {
            const pension = await Pension.findOneBy({ uuid });
            if (!pension)
                throw new DatabaseError(
                    "Pension not found",
                    500,
                    "Database Error"
                );

            pension.fecha_limite = fecha;
            await pension.save();
            await pension.reload();

            return pension;
        } catch (error) {
            throw error;
        }
    }
}
