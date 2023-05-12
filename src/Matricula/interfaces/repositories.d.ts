import { Carrera, Grupo, Modulo } from "../entity";
import { CareerDTO, GroupDTO, ModuleDTO } from "./dtos";

export interface ModuleRepository {
    register(data: ModuleDTO): Promise<Modulo>;
    findByUuid(uuid: string): Promise<Modulo>;
    findByName(name: string): Promise<Modulo>;
}

export interface CareerRepository {
    register(data: CareerDTO): Promise<Carrera>;
    listModules(uuid: string): Promise<Modulo[]>;
    findByUuid(uuid: string): Promise<Carrera>;
    findByName(name: string): Promise<Carrera>;
}

export interface GroupRepository {
    register(data: GroupDTO): Promise<Grupo>;
    listGroups(): Promise<Grupo[]>;
    listEstudents(uuid: string): Promise<any>; //TODO Debe retornar un arreglo de matriculas o alumnos
    findByUuid(uuid: string): Promise<Grupo>;
    findByName(name: string): Promise<Grupo>;
}
