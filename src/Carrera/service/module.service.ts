import { v4 as uuid } from "uuid";
import { DatabaseError } from "../../errors/DatabaseError";
import { Modulo } from "../../Matricula/entity";
import { ModuleRepository } from "../../Matricula/interfaces/repositories";
import { RegisterModuleDto } from "../dto";

export class ModuleService implements ModuleRepository {
    public async register(data: RegisterModuleDto): Promise<Modulo> {
        try {
            const modulo = new Modulo();
            modulo.uuid = uuid();
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
