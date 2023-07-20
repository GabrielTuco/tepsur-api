import { Especializacion } from "../entity/Especializacion.entity";
import { EspecializacionDTO } from "./dtos";

export interface EspecializacionRepository {
    register(data: EspecializacionDTO): Promise<Especializacion>;
    listAll(): Promise<Especializacion[]>;
    findByUuid(uuid: string): Promise<Especializacion>;
    update(
        uuid: string,
        data: Partial<EspecializacionDTO>
    ): Promise<Especializacion>;
    delete(uuid: string): Promise<Especializacion>;
}
