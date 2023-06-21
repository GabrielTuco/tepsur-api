import { v4 as uuid } from "uuid";
import { Carrera, Grupo, Matricula } from "../entity";
import { GroupDTO } from "../interfaces/dtos";
import { GroupRepository } from "../interfaces/repositories";
import { Horario } from "../entity/Horario.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { TIPO_CARRERA } from "../../interfaces/enums";

export class GroupService implements GroupRepository {
    /**
     * Servicio para registrar un nuevo grupo
     * @param {GroupDTO} data - Datos del grupo a registrar
     * @returns {Promise<Grupo>} Los datos registrados del nuevo grupo
     */
    public async register(data: GroupDTO): Promise<Grupo> {
        try {
            const grupo = new Grupo();
            const carreraExists = await Carrera.findOneBy({
                uuid: data.carreraUuid,
            });
            if (carreraExists?.tipo_carrera === TIPO_CARRERA.MODULAR) {
                throw new Error(
                    "No se puede crear un grupo para este tipo de carrera"
                );
            }

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

    public async addStudent(
        matriculaUuid: string,
        grupoUuid: string
    ): Promise<Grupo> {
        try {
            const student = await Matricula.findOne({
                where: { uuid: matriculaUuid },
                relations: { carrera: true },
            });
            const grupo = await Grupo.findOne({ where: { uuid: grupoUuid } });

            if (!student || !grupo)
                throw new DatabaseError(
                    "Student or grupo not found",
                    500,
                    "Database error"
                );
            const carrera = await Carrera.findOneBy({
                uuid: student.carrera.uuid,
            });
            if (carrera?.tipo_carrera !== TIPO_CARRERA.SEMESTRAL)
                throw new Error("La carrera no es de tipo semestral");

            student.grupo = grupo!;

            await grupo.save();
            await grupo.reload();
            return grupo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async listGroups(): Promise<Grupo[]> {
        try {
            const grupos = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.docente", "d")
                .innerJoinAndSelect("g.horario", "h")
                .innerJoinAndSelect("g.carrera", "c")
                .leftJoinAndSelect("g.matriculas", "m")
                .leftJoinAndSelect("m.alumno", "a")
                .leftJoinAndSelect("m.secretaria", "s")
                .getMany();
            const grupos2 = await Grupo.find();

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
            const group = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.docente", "d")
                .innerJoinAndSelect("g.horario", "h")
                .innerJoinAndSelect("g.carrera", "c")
                .leftJoinAndSelect("g.matriculas", "m")
                .leftJoinAndSelect("m.alumno", "a")
                .leftJoinAndSelect("m.secretaria", "s")
                .where("g.uuid=:uuid", { uuid })
                .getOne();

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
