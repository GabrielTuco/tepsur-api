import { Carrera } from "../carrera.entity";
import { Modulo } from "../modulo.entity";
import { CarreraDTO, ModuloDTO } from "./dtos";

export interface CarreraRepository {
    register(data: CarreraDTO): Promise<Carrera>;
    findByUuid(uuid: string): Promise<Carrera>;
    listAll(): Promise<Carrera[]>;
}

export interface ModuloRepository {
    register(data: ModuloDTO): Promise<Modulo>;
    findAll(): Promise<Modulo[]>;
    findByUuid(uuid: string): Promise<Modulo>;
}
