import { Sede } from "../entity/Sede.entity";

export interface SedeRepository {
    listAll(): Promise<Sede[]>;
    findById(id: number): Promise<Sede | null>;
    register(sede: SedeDTO): Promise<Sede>;
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
