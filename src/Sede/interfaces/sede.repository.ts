import { Sede } from "../entity/Sede.entity";

export interface SedeRepository {
    listAll(): Promise<Sede[]>;
    findById(uuid: string): Promise<Sede | null>;
    register(sede: SedeDTO): Promise<Sede>;
    delete(uuid: string): Promise<Sede>;
}

export interface SedeDTO {
    nombre: string;
    direccion: {
        direccionExacta: string;
        distrito: string;
        provincia: string;
        departamento: string;
    };
}
