import { v4 as uuid } from "uuid";
import { DatabaseError } from "../../errors/DatabaseError";
import { Carrera, TarifaPensionCarrera } from "../entity";
import { TarifaPensionCarreraDTO } from "../interfaces/dtos";
import { TarifaPensionCarreraRepository } from "../interfaces/repositories";

export class TarifaPensionCarreraService
    implements TarifaPensionCarreraRepository
{
    public async register(
        data: TarifaPensionCarreraDTO
    ): Promise<TarifaPensionCarrera> {
        try {
            const carrera = await Carrera.findOne({
                where: { uuid: data.carreraUuid },
            });
            if (!carrera) throw new DatabaseError("Carrera not found", 500, "");

            const tarifa = await TarifaPensionCarrera.createQueryBuilder("t")
                .innerJoinAndSelect("t.carrera", "c")
                .where("c.uuid=:uuid", { uuid: carrera.uuid })
                .getOne();

            if (tarifa) {
                tarifa.tarifa = data.tarifa;
                await tarifa.save();
                await tarifa.reload();

                return tarifa;
            } else {
                const newTarifa = new TarifaPensionCarrera();
                newTarifa.uuid = uuid();
                newTarifa.carrera = carrera;
                newTarifa.tarifa = data.tarifa;
                await newTarifa.save();
                return newTarifa;
            }
        } catch (error) {
            throw error;
        }
    }
    public async listAll(): Promise<TarifaPensionCarrera[]> {
        try {
            const tarifas = await TarifaPensionCarrera.find({
                relations: { carrera: true },
            });
            return tarifas;
        } catch (error) {
            throw error;
        }
    }
    public async findByUuid(uuid: string): Promise<TarifaPensionCarrera> {
        try {
            const tarifa = await TarifaPensionCarrera.findOne({
                where: { uuid },
            });

            return tarifa!;
        } catch (error) {
            throw error;
        }
    }
    public async findByCarreraUuid(
        carreraUuid: string
    ): Promise<TarifaPensionCarrera> {
        try {
            const carrera = await Carrera.findOne({
                where: { uuid: carreraUuid },
            });
            if (!carrera) throw new DatabaseError("Carrera not found", 500, "");

            const tarifa = await TarifaPensionCarrera.createQueryBuilder("t")
                .innerJoinAndSelect("t.carrera", "c")
                .where("c.uuid=:uuid", { uuid: carrera.uuid })
                .getOne();

            return tarifa!;
        } catch (error) {
            throw error;
        }
    }
    public async update(
        uuid: string,
        data: { tarifa: number }
    ): Promise<TarifaPensionCarrera> {
        try {
            const tarifa = await TarifaPensionCarrera.findOneBy({ uuid });
            if (!tarifa) throw new Error("Tarifa not found");
            tarifa.tarifa = data.tarifa;
            await tarifa.save();
            await tarifa.reload();

            return tarifa;
        } catch (error) {
            throw error;
        }
    }
    public async delete(uuid: string): Promise<TarifaPensionCarrera> {
        try {
            const tarifa = await TarifaPensionCarrera.findOneBy({ uuid });
            await TarifaPensionCarrera.remove(tarifa!);

            return tarifa!;
        } catch (error) {
            throw error;
        }
    }
}
