import { v4 as uuid } from "uuid";
import { Pension } from "../entity/Pension.entity";
import { RegisterPagoPensionDto, RegisterPensionDTO } from "../interfaces/dtos";
import { PensionRepository } from "../interfaces/repositories";
import { DatabaseError } from "../../errors/DatabaseError";
import { Alumno } from "../../Student/entity";
import { PagoPension } from "../entity";
import { Matricula, MetodoPago } from "../../Matricula/entity";
import fileUpload from "express-fileupload";
import { uploadImage } from "../../helpers/uploadImage";
import { AlreadyExistsError } from "../../errors/AlreadyExistsError";

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
        pensionUuid: string,
        data: RegisterPagoPensionDto
    ): Promise<PagoPension> {
        try {
            const pagoPensionExists = await PagoPension.createQueryBuilder("p")
                .innerJoinAndSelect("p.pension", "pe")
                .where("pe.uuid=:uuid", { uuid: pensionUuid })
                .getOne();

            if (pagoPensionExists)
                throw new AlreadyExistsError(
                    "Ya se registro el pago de esta mensualidad"
                );

            const pension = await Pension.findOneBy({ uuid: pensionUuid });
            const formaPago = await MetodoPago.findOneBy({
                uuid: data.formaPagoUuid,
            });

            const pagoPension = new PagoPension();
            pagoPension.uuid = uuid();
            pagoPension.pension = pension!;
            pagoPension.forma_pago = formaPago!;
            pagoPension.fecha = data.fecha;
            pagoPension.hora = data.hora;
            pagoPension.monto = pension!.monto;
            pagoPension.num_comprobante = data.numComprobante;
            await pagoPension.save();

            return pagoPension;
        } catch (error) {
            throw error;
        }
    }

    public async listPagosHechos() {
        try {
            const pagos = PagoPension.createQueryBuilder("pp")
                .innerJoinAndSelect("pp.pension", "p")
                .innerJoinAndSelect("pp.forma_pago", "fp")
                .getMany();

            return pagos;
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
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("a.direccion", "d")
                .innerJoinAndSelect("a.grado_estudios", "ge")
                .innerJoinAndSelect("m.secretaria", "s")
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

    public async findUltimoPago(matriculaUuid: string) {
        try {
            const matricula = await Matricula.findOneBy({
                uuid: matriculaUuid,
            });
            if (!matricula)
                throw new DatabaseError(
                    "La matricula no existe",
                    404,
                    "Not found error"
                );

            const pago = await Pension.createQueryBuilder("p")
                .innerJoin("p.matricula", "m")
                .innerJoin("m.alumno", "a")
                .innerJoinAndSelect("p.pago_pension", "pp")
                .where("m.uuid=:uuid and m.estado='true'", {
                    uuid: matriculaUuid,
                })
                .orderBy("p.fecha_limite", "ASC")
                .limit(1)
                .getOne();

            return pago!;
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

    public async uploadPaidDocument(
        uuid: string,
        image: fileUpload.UploadedFile
    ) {
        try {
            const pension = await PagoPension.findOneBy({ uuid });
            if (!pension)
                throw new DatabaseError(
                    "No existe el registro de este pago",
                    404,
                    "Not found error"
                );

            pension.foto_comprobante = await uploadImage(
                pension.foto_comprobante,
                image,
                "pago-pensiones"
            );

            await pension.save();
            await pension.reload();
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
