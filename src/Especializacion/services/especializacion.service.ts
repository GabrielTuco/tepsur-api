import { v4 as uuid } from "uuid";
import { Especializacion } from "../entity/Especializacion.entity";
import { EspecializacionRepository } from "../interfaces/repository";
import { DatabaseError } from "../../errors/DatabaseError";
import { RegisterEspecializacionDto } from "../dto/registerEspecializacion.dto";
import { Sede } from "../../Sede/entity";
import { NotFoundError } from "../../errors/NotFoundError";

export class EspecializacionService implements EspecializacionRepository {
    public register = async (
        data: RegisterEspecializacionDto
    ): Promise<Especializacion> => {
        try {
            const sede = await Sede.findOneBy({ uuid: data.sedeUuid });
            if (!sede) throw new NotFoundError("La sede no existe");

            const especializacion = new Especializacion();
            especializacion.uuid = uuid();
            especializacion.nombre = data.nombre;
            especializacion.duracion_semanas = data.duracionSemanas;
            especializacion.precio = data.precio;
            especializacion.sedes.push(sede);

            await especializacion.save();

            return especializacion;
        } catch (error) {
            throw error;
        }
    };
    public listAll = async (): Promise<Especializacion[]> => {
        try {
            const especializaciones = await Especializacion.find({
                relations: { sedes: true },
            });

            return especializaciones;
        } catch (error) {
            throw error;
        }
    };

    public listBySede = async (
        sedeUuid: string
    ): Promise<Especializacion[]> => {
        try {
            const sede = await Sede.findOne({
                where: { uuid: sedeUuid },
                relations: { especializaciones: true },
            });

            if (!sede) throw new NotFoundError("La sede no existe");

            const { especializaciones } = sede;

            return especializaciones;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<Especializacion> => {
        try {
            const especializacion = await Especializacion.findOneBy({
                uuid,
                estado: true,
            });
            if (!especializacion)
                throw new DatabaseError(
                    "La especializacion no existe",
                    404,
                    "Not found error"
                );

            return especializacion;
        } catch (error) {
            throw error;
        }
    };
    public update = async (
        uuid: string,
        data: Partial<RegisterEspecializacionDto>
    ): Promise<Especializacion> => {
        try {
            const especializacion = await this.findByUuid(uuid);
            const adaptedData = {
                nombre: data.nombre,
                duracion_semanas: data.duracionSemanas,
                precio: data.precio,
            };

            await Especializacion.update({ uuid }, adaptedData);
            await especializacion.reload();

            return especializacion;
        } catch (error) {
            throw error;
        }
    };

    public delete = async (uuid: string): Promise<Especializacion> => {
        try {
            const especializacion = await this.findByUuid(uuid);

            especializacion.estado = false;
            await especializacion.save();
            await especializacion.reload();

            return especializacion;
        } catch (error) {
            throw error;
        }
    };
}
