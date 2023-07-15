import { Usuario } from "../../Auth/entity";
import { Secretaria } from "../entity/Secretaria.entity";
import { CreateSecretaryUserDTO, CreateSecretaryDTO } from "./secretary.dto";

export interface SecretaryRepository {
  register(data: CreateSecretaryDTO): Promise<Secretaria>;
  listAll(): Promise<Secretaria[]>;
  listBySede(sede: string): Promise<Secretaria[]>;
  createUser(data: CreateSecretaryUserDTO): Promise<Secretaria>;
  searchByUser(usuario: Usuario): Promise<Secretaria>;
  update(uuid: string, data: Partial<CreateSecretaryDTO>): Promise<Secretaria>;
  delete(uuid: string): Promise<Secretaria>;
}
