import { DatabaseError } from "../../errors/DatabaseError";
import { Modulo } from "../entity";
import { ModuleDTO } from "../interfaces/dtos";
import { ModuleRepository } from "../interfaces/repositories";

export class ModuleService implements ModuleRepository {
    public async register(data: ModuleDTO): Promise<Modulo> {
        try {
            const modulo = new Modulo();
            modulo.nombre = data.nombre;
            modulo.duracion_semanas = data.duracionSemanas;

            return await modulo.save();
        } catch (error) {
            throw error;
        }
    }
    public async findByUuid(uuid: string): Promise<Modulo> {
        try {
            const modulo = await Modulo.findOneBy({ uuid });
            if (!modulo) {
                throw new DatabaseError(
                    "No se pudo encontrar el registro",
                    404,
                    ""
                );
            }
            return modulo;
        } catch (error) {
            throw error;
        }
    }
    public async findByName(name: string): Promise<Modulo> {
        try {
            const modulo = await Modulo.findOneBy({ nombre: name });
            if (!modulo) {
                throw new DatabaseError(
                    "No se pudo encontrar el registro",
                    404,
                    ""
                );
            }
            return modulo;
        } catch (error) {
            throw error;
        }
    }
}
