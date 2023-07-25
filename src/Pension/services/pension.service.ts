import { v4 as uuid } from "uuid";
import { Pension } from "../entity/Pension.entity";
import { RegisterPagoPensionDto, RegisterPensionDTO } from "../interfaces/dtos";
import { PensionRepository } from "../interfaces/repositories";
import { DatabaseError } from "../../errors/DatabaseError";
import { Alumno } from "../../Student/entity";
import { PagoPension } from "../entity";
import { MetodoPago } from "../../Matricula/entity";

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

    public async pagarPension(
        uuid: string,
        data: RegisterPagoPensionDto
    ): Promise<PagoPension> {
        try {
            const pagoPensionExists = await PagoPension.createQueryBuilder("p")
                .innerJoinAndSelect("p.pension", "pe")
                .where("pe.uuid=:uuid", { uuid })
                .getOne();

            if (pagoPensionExists)
                throw new DatabaseError(
                    "Ya se registro el pago de esta mensualidad",
                    403,
                    "Already exists error"
                );

            const pension = await Pension.findOneBy({ uuid });
            const formaPago = await MetodoPago.findOneBy({
                uuid: data.formaPagoUuid,
            });

            const pagoPension = new PagoPension();
            pagoPension.pension = pension!;
            pagoPension.forma_pago = formaPago!;
            pagoPension.fecha = data.fecha;
            pagoPension.monto = pension!.monto;
            pagoPension.num_comprobante = data.numComprobante;
            pagoPension.entidad_bancaria = data.entidadBancaria;
            await pagoPension.save();

            return pagoPension;
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

    public async listPensionByDni(
        dni: string
    ): Promise<{ alumno: Alumno; pensiones: Pension[] }> {
        try {
            const alumno = await Alumno.findOneBy({ dni });
            if (!alumno)
                throw new DatabaseError(
                    "El alumno no existe",
                    404,
                    "Not found error"
                );
            const pensiones = await Pension.createQueryBuilder("p")
                .innerJoin("p.matricula", "m")
                .innerJoin("m.alumno", "a")
                .leftJoinAndSelect("p.pago_pension", "pp")
                .where("a.dni=:dni and m.estado='true'", { dni })
                .getMany();

            return { alumno, pensiones };
        } catch (error) {
            throw error;
        }
    }

    public async findByUuid(uuid: string): Promise<Pension> {
        try {
            const pension = await Pension.findOneBy({ uuid });
            if (!pension)
                throw new DatabaseError(
                    "La pension no existe",
                    404,
                    "Not found error"
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
