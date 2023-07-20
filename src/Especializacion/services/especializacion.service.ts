import { v4 as uuid } from "uuid";
import { Especializacion } from "../entity/Especializacion.entity";
import { EspecializacionDTO } from "../interfaces/dtos";
import { EspecializacionRepository } from "../interfaces/repository";
import { DatabaseError } from "../../errors/DatabaseError";

export class EspecializacionService implements EspecializacionRepository {
    public register = async (
        data: EspecializacionDTO
    ): Promise<Especializacion> => {
        try {
            const especializacion = new Especializacion();
            especializacion.uuid = uuid();
            especializacion.nombre = data.nombre;
            especializacion.duracion_semanas = data.duracionSemanas;
            especializacion.precio = data.precio;

            await especializacion.save();

            return especializacion;
        } catch (error) {
            throw error;
        }
    };
    public listAll = async (): Promise<Especializacion[]> => {
        try {
            const especializaciones = await Especializacion.find();

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
        data: Partial<EspecializacionDTO>
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
