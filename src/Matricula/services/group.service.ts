import { v4 as uuid } from "uuid";
import { Carrera, Grupo, Matricula } from "../entity";
import { GroupDTO } from "../interfaces/dtos";
import { GroupRepository } from "../interfaces/repositories";
import { Horario } from "../entity/Horario.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Docente } from "../../Teacher/entity/Docente.entity";

export class GroupService implements GroupRepository {
    public async register(data: GroupDTO): Promise<Grupo> {
        try {
            const grupo = new Grupo();
            const carreraExists = await Carrera.findOneBy({
                uuid: data.carreraUuid,
            });

            //?Este horario debe pertenecer a la carrera
            const horarioExists = await Horario.findOneBy({
                uuid: data.horarioUuid,
            });

            const docenteExists = await Docente.findOneBy({
                uuid: data.docenteUuid,
            });

            grupo.uuid = uuid();
            grupo.nombre = data.nombre;
            grupo.fecha_inicio = data.fechaInicio;
            grupo.horario = horarioExists!;
            grupo.carrera = carreraExists!;
            grupo.docente = docenteExists!;
            grupo.cupos_maximos = data.cuposMaximos;

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
    public async listEstudents(uuid: string): Promise<Matricula[]> {
        try {
            const grupo = await Grupo.findOneBy({ uuid });
            if (!grupo) throw new DatabaseError("Grupo no encontrado", 404, "");

            const students = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoin("m.grupo", "g")
                .where("g.uuid= :uuid", { uuid })
                .getMany();

            return students;
        } catch (error) {
            throw error;
        }
    }
    public async findByUuid(uuid: string): Promise<Grupo> {
        try {
            const group = await Grupo.findOneBy({ uuid });
            if (!group) throw new DatabaseError("Grupo no encontrado", 404, "");

            return group;
        } catch (error) {
            throw error;
        }
    }
    public async findByName(nombre: string): Promise<Grupo> {
        try {
            const group = await Grupo.findOneBy({ nombre });
            if (!group) throw new DatabaseError("Grupo no encontrado", 404, "");

            return group;
        } catch (error) {
            throw error;
        }
    }
}
