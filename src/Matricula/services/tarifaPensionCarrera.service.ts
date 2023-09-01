import { v4 as uuid } from "uuid";
import { DatabaseError } from "../../errors/DatabaseError";
import { Carrera, TarifaPensionCarrera } from "../entity";
import { TarifaPensionCarreraRepository } from "../interfaces/repositories";
import { CreateTarifaPensionDto } from "../dto/createTarifaPension.dto";
import { Sede } from "../../Sede/entity";
import { NotFoundError } from "../../errors/NotFoundError";

export class TarifaPensionCarreraService
    implements TarifaPensionCarreraRepository
{
    public register = async (
        data: CreateTarifaPensionDto
    ): Promise<TarifaPensionCarrera> => {
        const { carreraUuid, sedeUuid, tarifa, modalidad } = data;
        try {
            const sede = await Sede.findOneBy({ uuid: sedeUuid });

            const carrera = await Carrera.findOne({
                where: { uuid: carreraUuid },
            });

            if (!sede) throw new NotFoundError("La sede no existe");
            if (!carrera) throw new NotFoundError("La carrera no existe");

            const tarifaExists = await TarifaPensionCarrera.createQueryBuilder(
                "t"
            )
                .innerJoin("t.carrera", "c")
                .innerJoin("t.sede", "s")
                .where(
                    "s.uuid=:sedeUuid and c.uuid=:carreraUuid and t.modalidad=:modalidad",
                    {
                        sedeUuid,
                        carreraUuid,
                        modalidad,
                    }
                )
                .getOne();

            if (tarifaExists) {
                tarifaExists.tarifa = tarifa;
                await tarifaExists.save();
                await tarifaExists.reload();

                return tarifaExists;
            } else {
                const newTarifa = new TarifaPensionCarrera();
                newTarifa.uuid = uuid();
                newTarifa.sede = sede;
                newTarifa.carrera = carrera;
                newTarifa.tarifa = tarifa;
                newTarifa.modalidad = modalidad;
                await newTarifa.save();
                return newTarifa;
            }
        } catch (error) {
            throw error;
        }
    };

    public listAll = async (): Promise<TarifaPensionCarrera[]> => {
        try {
            const tarifas = await TarifaPensionCarrera.find({
                relations: { carrera: true },
            });
            return tarifas;
        } catch (error) {
            throw error;
        }
    };

    public listBySede = async (
        sedeUuid: string
    ): Promise<TarifaPensionCarrera[]> => {
        try {
            const tarifas = await TarifaPensionCarrera.createQueryBuilder("t")
                .innerJoinAndSelect("t.sede", "s")
                .innerJoinAndSelect("t.carrera", "c")
                .where("s.uuid=:sedeUuid", { sedeUuid })
                .getMany();

            return tarifas;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<TarifaPensionCarrera> => {
        try {
            const tarifa = await TarifaPensionCarrera.findOne({
                where: { uuid },
            });

            return tarifa!;
        } catch (error) {
            throw error;
        }
    };

    public findByCarreraUuid = async (
        carreraUuid: string
    ): Promise<TarifaPensionCarrera> => {
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
    };

    public update = async (
        uuid: string,
        data: { tarifa: number }
    ): Promise<TarifaPensionCarrera> => {
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
    };

    public delete = async (uuid: string): Promise<TarifaPensionCarrera> => {
        try {
            const tarifa = await TarifaPensionCarrera.findOneBy({ uuid });
            await TarifaPensionCarrera.remove(tarifa!);

            return tarifa!;
        } catch (error) {
            throw error;
        }
    };
}
