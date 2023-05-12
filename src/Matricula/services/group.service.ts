import { v4 as uuid } from "uuid";
import { Carrera, Grupo } from "../entity";
import { GroupDTO } from "../interfaces/dtos";
import { GroupRepository } from "../interfaces/repositories";
import { Horario } from "../entity/Horario.entity";

export class GroupService implements GroupRepository {
    public async register(data: GroupDTO): Promise<Grupo> {
        try {
            const grupo = new Grupo();
            const carreraExists = await Carrera.findOneBy({
                uuid: data.carreraUuid,
            });

            const horarioExists = await Horario.findOneBy({
                uuid: data.horarioUuid,
            });

            grupo.uuid = uuid();
            grupo.nombre = data.nombre;
            grupo.fecha_inicio = data.fechaInicio;
            grupo.horario = horarioExists!;
            grupo.carrera = carreraExists!;

            return await grupo.save();
        } catch (error) {
            throw error;
        }
    }

    public async listGroups(): Promise<Grupo[]> {
        try {
            const grupos = await Grupo.find();

            return grupos;
        } catch (error) {
            throw error;
        }
    }
    public async listEstudents(uuid: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    public async findByUuid(uuid: string): Promise<Grupo> {
        throw new Error("Method not implemented.");
    }
    public async findByName(name: string): Promise<Grupo> {
        throw new Error("Method not implemented.");
    }
}
