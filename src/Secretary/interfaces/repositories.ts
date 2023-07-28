import { Usuario } from "../../Auth/entity";
import {
    CreateSecretaryDTO,
    CreateSecretaryUserDTO,
    UpdateSecretaryDTO,
} from "../dtos";
import { Secretaria } from "../entity/Secretaria.entity";

export interface SecretaryRepository {
    register(data: CreateSecretaryDTO): Promise<Secretaria>;
    listAll(): Promise<Secretaria[]>;
    listBySede(sede: string): Promise<Secretaria[]>;
    createUser(data: CreateSecretaryUserDTO): Promise<Usuario>;
    searchByUser(usuario: Usuario): Promise<Secretaria>;
    update(uuid: string, data: UpdateSecretaryDTO): Promise<Secretaria>;
    delete(uuid: string): Promise<Secretaria>;
}
