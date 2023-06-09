import { v4 as uuid } from "uuid";
import { Carrera, Grupo, Matricula, MatriculaGruposGrupo } from "../entity";
import { GroupDTO } from "../interfaces/dtos";
import { GroupRepository } from "../interfaces/repositories";
import { Horario } from "../entity/Horario.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity";

export class GroupService implements GroupRepository {
    /**
     * Servicio para registrar un nuevo grupo
     * @param {GroupDTO} data - Datos del grupo a registrar
     * @returns {Promise<Grupo>} Los datos registrados del nuevo grupo
     */
    public register = async (data: GroupDTO): Promise<Grupo> => {
        try {
            const grupo = new Grupo();

            const sedeExists = await Sede.findOne({
                where: { uuid: data.sedeUuid },
                relations: {
                    carreras: true,
                    docentes: true,
                    secretarias: true,
                },
            });

            const carreraExists = await Carrera.findOne({
                where: { uuid: data.carreraUuid },
                relations: { modulos: true },
            });

            const horarioExists = await Horario.findOneBy({
                uuid: data.horarioUuid,
            });

            const docenteExists = await Docente.findOneBy({
                uuid: data.docenteUuid,
            });

            const secretariaExists = await Secretaria.findOneBy({
                uuid: data.responsableUuid,
            });

            //Validar que la carrera existe en la sede
            const isCarreraValid = sedeExists?.carreras.find(
                (c) => c.uuid == carreraExists!.uuid
            );

            const isDocenteValid = sedeExists?.docentes.find(
                (d) => d.uuid === docenteExists?.uuid
            );

            const isSecretariaValid = sedeExists?.secretarias.find(
                (s) => s.uuid === secretariaExists?.uuid
            );

            if (!isDocenteValid) {
                throw new DatabaseError(
                    "El docente no existe en esta sede",
                    404,
                    "Database found error"
                );
            }

            if (!isCarreraValid) {
                throw new DatabaseError(
                    "La carrera no existe en esta sede",
                    404,
                    "Database found error"
                );
            }

            if (!isSecretariaValid) {
                throw new DatabaseError(
                    "La secretaria no existe en esta sede",
                    404,
                    "Database found error"
                );
            }

            const moduloExists = carreraExists?.modulos.find(
                (modulo) => modulo.uuid === data.moduloUuid
            );

            grupo.uuid = uuid();
            grupo.nombre = data.nombre;
            grupo.fecha_inicio = data.fechaInicio;
            grupo.sede = sedeExists!;
            grupo.horario = horarioExists!;
            grupo.carrera = carreraExists!;
            grupo.modulo = moduloExists!;
            grupo.docente = docenteExists!;
            grupo.secretaria = secretariaExists!;
            grupo.modalidad = data.modalidad;
            grupo.cupos_maximos = data.cuposMaximos;

            return await grupo.save();
        } catch (error) {
            throw error;
        }
    };

    /**
     * Servicio para agregar un alumno a un grupo que pertenezca a la carrera en la que esta matriculado
     * @param {string} matriculaUuid Uuid unico de la matricula de alumno
     * @param {string} grupoUuid Uuid unico del grupo donde se agregara al alumno
     * @returns {Promise<Grupo>}
     */
    public addStudent = async (
        matriculaUuid: string,
        grupoUuid: string
    ): Promise<Grupo> => {
        try {
            const student = await Matricula.findOne({
                where: { uuid: matriculaUuid },
                relations: { carrera: true },
            });
            const grupo = await Grupo.findOne({ where: { uuid: grupoUuid } });

            if (!student || !grupo)
                throw new DatabaseError(
                    "Student or grupo not found",
                    404,
                    "Database error"
                );

            const newMatriculaGrupo = new MatriculaGruposGrupo();
            newMatriculaGrupo.matricula = student;
            newMatriculaGrupo.grupo = grupo;

            await newMatriculaGrupo.save();

            await grupo.save();
            await grupo.reload();
            return grupo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    /**
     * Servicio que retorna el listado de todos los grupos creados
     * @returns {Promise<Grupo[]>} Grupos Listado de grupos
     */
    public listGroups = async (): Promise<Grupo[]> => {
        try {
            const grupos = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.docente", "d")
                .innerJoinAndSelect("g.horario", "h")
                .innerJoinAndSelect("g.carrera", "c")
                .leftJoinAndSelect("g.secretaria", "s")
                .innerJoinAndSelect("g.modulo", "m")
                .innerJoinAndSelect("g.sede", "se")
                .getMany();

            return grupos;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Servicio para obtener el listado de los alumnos matriculados en un grupo
     * @param {string} uuid Uuid del grupo
     * @returns {Promise<Matricula[]>} Listado de matriculados en el grupo
     */
    public listEstudents = async (uuid: string): Promise<Matricula[]> => {
        try {
            const grupo = await Grupo.findOneBy({ uuid });
            if (!grupo) throw new DatabaseError("Grupo no encontrado", 404, "");

            const studentsByGrupo = await MatriculaGruposGrupo.find({
                where: {
                    grupoUuid: grupo.uuid,
                },
                relations: { matricula: true },
            });

            const students = studentsByGrupo.map(
                (student) => student.matricula
            );

            return students;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<Grupo> => {
        try {
            const group = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.docente", "d")
                .innerJoinAndSelect("g.horario", "h")
                .innerJoinAndSelect("g.carrera", "c")
                //.leftJoinAndSelect("g.matriculas", "m")
                //.leftJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("g.modulo", "m")
                .leftJoinAndSelect("g.secretaria", "s")
                .where("g.uuid=:uuid", { uuid })
                .getOne();

            if (!group) throw new DatabaseError("Grupo no encontrado", 404, "");

            return group;
        } catch (error) {
            throw error;
        }
    };

    public findByName = async (nombre: string): Promise<Grupo> => {
        try {
            const group = await Grupo.findOneBy({ nombre });
            if (!group) throw new DatabaseError("Grupo no encontrado", 404, "");

            return group;
        } catch (error) {
            throw error;
        }
    };
}
