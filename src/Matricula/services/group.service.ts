import { v4 as uuid } from "uuid";
import { Carrera, Grupo, Matricula, MatriculaGruposGrupo } from "../entity";
import { GroupDTO, GrupoWithStudents } from "../interfaces/dtos";
import { GroupRepository } from "../interfaces/repositories";
import { Horario } from "../entity/Horario.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity";
import { CONDICION_ALUMNO, ESTADO_GRUPO } from "../../interfaces/enums";
import { PensionService } from "../../Pension/services/pension.service";
import { NotFoundError } from "../../errors/NotFoundError";

const pensionService = new PensionService();
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
                throw new NotFoundError("El docente no existe en esta sede");
            }

            if (!isCarreraValid) {
                throw new NotFoundError("La carrera no existe en esta sede");
            }

            if (!isSecretariaValid) {
                throw new NotFoundError("La secretaria no existe en esta sede");
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
     * @param {object} matriculasUuid Uuid unico de la matricula de alumno
     * @param {string} grupoUuid Uuid unico del grupo donde se agregara al alumno
     * @returns {Promise<Grupo>}
     */
    public addStudent = async (
        matriculasUuid: { matriculaUuid: string; observaciones: string }[],
        grupoUuid: string,
        secretariaUuid: string
    ): Promise<any> => {
        try {
            const grupo = await Grupo.findOne({
                where: { uuid: grupoUuid },
                relations: { horario: true },
            });
            const secretaria = await Secretaria.findOneBy({
                uuid: secretariaUuid,
            });

            if (!grupo) throw new NotFoundError("El grupo no existe");
            if (!secretaria) throw new NotFoundError("La secretaria existe");

            console.log(matriculasUuid);

            const students = await Promise.all(
                matriculasUuid.map(async ({ matriculaUuid, observaciones }) => {
                    const matricula = await Matricula.createQueryBuilder("m")
                        .innerJoinAndSelect("m.carrera", "c")
                        .leftJoinAndSelect("m.matriculaGruposGrupo", "mgg")
                        .leftJoinAndSelect("m.ultimo_grupo", "ug")
                        .leftJoinAndSelect("ug.horario", "h")
                        .where("m.uuid=:matriculaUuid", { matriculaUuid })
                        .getOne();

                    if (matricula) {
                        return { matricula, observaciones };
                    } else return undefined;
                })
            );
            type MatriculaWithObservaciones = {
                matricula: Matricula;
                observaciones: string;
            };

            const studentsArray = students.filter(
                (element): element is MatriculaWithObservaciones =>
                    element !== undefined
            );

            studentsArray.map(async ({ matricula, observaciones }) => {
                const newMatriculaGrupo = new MatriculaGruposGrupo();
                newMatriculaGrupo.uuid = uuid();
                newMatriculaGrupo.matricula = matricula;
                newMatriculaGrupo.grupo = grupo;
                newMatriculaGrupo.responsable = secretaria;
                newMatriculaGrupo.observacion = observaciones;

                if (!matricula.ultimo_grupo) {
                    matricula.ultimo_grupo = grupo;
                    newMatriculaGrupo.condicion = CONDICION_ALUMNO.NUEVO;
                } else {
                    //si no es nuevo ver que horarios y modulos ha llevado establecer si continua o es cambio de horario
                    if (
                        matricula.ultimo_grupo.estado === ESTADO_GRUPO.EN_CURSO
                    ) {
                        throw new DatabaseError(
                            "No se puede agregar a un alumno que se encuentra en un grupo activo",
                            406,
                            "Not aceptable"
                        );
                    }
                    if (
                        matricula.ultimo_grupo.horario.uuid ===
                        grupo.horario.uuid
                    ) {
                        newMatriculaGrupo.condicion = CONDICION_ALUMNO.CONTINUA;
                    } else {
                        newMatriculaGrupo.condicion =
                            CONDICION_ALUMNO.CAMBIO_HORARIO;
                    }

                    matricula.ultimo_grupo = grupo;
                }

                await newMatriculaGrupo.save();
                matricula.matriculaGruposGrupo.push(newMatriculaGrupo);
                await matricula.save();
            });

            await grupo.save();
            await grupo.reload();

            const studentsGrupo = await this.listEstudents(grupoUuid);

            return studentsGrupo;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    public listGroups = async (
        year: string | undefined,
        month: string | undefined
    ): Promise<any> => {
        try {
            const grupos = await Grupo.createQueryBuilder("g")
                .leftJoinAndSelect("g.docente", "d")
                .leftJoinAndSelect("g.horario", "h")
                .leftJoinAndSelect("g.carrera", "c")
                .leftJoinAndSelect("g.secretaria", "s")
                .leftJoinAndSelect("g.modulo", "m")
                .leftJoinAndSelect("g.sede", "se")
                .leftJoinAndSelect("g.matriculaGruposGrupo", "mgg")
                .where(
                    `EXTRACT(YEAR from g.fecha_inicio)=:year ${
                        month
                            ? "and EXTRACT(MONTH from g.fecha_inicio)=:month "
                            : ""
                    }`,
                    { year, month }
                )
                .orderBy("g.fecha_inicio", "DESC")
                .getMany();
            const gruposWithStudentsCountMapped = grupos.map(
                ({ matriculaGruposGrupo, ...grupo }) => ({
                    ...grupo,
                    numero_matriculados: matriculaGruposGrupo.length,
                })
            );

            return gruposWithStudentsCountMapped;
        } catch (error) {
            throw error;
        }
    };

    public listGroupsBySecretary = async (
        secretariaUuid: string,
        year: string | undefined,
        month: string | undefined
    ): Promise<object[]> => {
        try {
            const grupos = await Grupo.createQueryBuilder("g")
                .leftJoinAndSelect("g.docente", "d")
                .leftJoinAndSelect("g.horario", "h")
                .leftJoinAndSelect("g.carrera", "c")
                .leftJoinAndSelect("g.secretaria", "s")
                .leftJoinAndSelect("g.modulo", "m")
                .leftJoinAndSelect("g.sede", "se")
                .leftJoinAndSelect("g.matriculaGruposGrupo", "mgg")
                // .where("s.uuid=:secretariaUuid", { secretariaUuid })
                .where(
                    `s.uuid=:secretariaUuid and EXTRACT(YEAR from g.fecha_inicio)=:year ${
                        month
                            ? "and EXTRACT(MONTH from g.fecha_inicio)=:month "
                            : ""
                    }`,
                    { secretariaUuid, year, month }
                )
                .orderBy("g.fecha_inicio", "DESC")
                .getMany();
            const gruposWithStudentsCountMapped = grupos.map(
                ({ matriculaGruposGrupo, ...grupo }) => ({
                    ...grupo,
                    numero_matriculados: matriculaGruposGrupo.length,
                })
            );
            return gruposWithStudentsCountMapped;
        } catch (error) {
            throw error;
        }
    };

    public listGroupsBySede = async (
        sedeUuid: string,
        year: string | undefined,
        month: string | undefined
    ): Promise<object[]> => {
        try {
            const grupos = await Grupo.createQueryBuilder("g")
                .leftJoinAndSelect("g.docente", "d")
                .leftJoinAndSelect("g.horario", "h")
                .leftJoinAndSelect("g.carrera", "c")
                .leftJoinAndSelect("g.secretaria", "s")
                .leftJoinAndSelect("g.modulo", "m")
                .leftJoinAndSelect("g.sede", "se")
                .leftJoinAndSelect("g.matriculaGruposGrupo", "mgg")
                .where(
                    `se.uuid=:sedeUuid and EXTRACT(YEAR from g.fecha_inicio)=:year ${
                        month
                            ? "and EXTRACT(MONTH from g.fecha_inicio)=:month "
                            : ""
                    }`,
                    { sedeUuid, year, month }
                )
                .getMany();
            const gruposWithStudentsCountMapped = grupos.map(
                ({ matriculaGruposGrupo, ...grupo }) => ({
                    ...grupo,
                    numero_matriculados: matriculaGruposGrupo.length,
                })
            );
            return gruposWithStudentsCountMapped;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Servicio para obtener el listado de los alumnos matriculados en un grupo
     * @param {string} uuid Uuid del grupo
     * @returns {Promise<Matricula[]>} Listado de matriculados en el grupo
     */
    public listEstudents = async (uuid: string): Promise<any[]> => {
        try {
            const grupo = await Grupo.findOneBy({ uuid });
            if (!grupo) throw new NotFoundError("Grupo no encontrado");

            const studentsByGrupo =
                await MatriculaGruposGrupo.createQueryBuilder("mg")
                    .innerJoinAndSelect("mg.matricula", "m")
                    .innerJoinAndSelect("m.alumno", "a")
                    .innerJoinAndSelect("mg.responsable", "r")
                    .innerJoinAndSelect("r.sede", "s")
                    .leftJoinAndSelect("r.usuario", "u")
                    .where("mg.grupoUuid=:uuid", { uuid })
                    .getMany();

            // const students = studentsByGrupo.map(
            //     (student) => student.matricula
            // );
            const data = await Promise.all(
                studentsByGrupo.map(async (matriculaGrupo) => {
                    const ultimoPago = await pensionService.findUltimoPago(
                        matriculaGrupo.matricula.uuid
                    );

                    return {
                        matriculaGrupo,
                        ultimoPago,
                    };
                })
            );

            return data;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<GrupoWithStudents> => {
        try {
            const group = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.docente", "d")
                .innerJoinAndSelect("g.horario", "h")
                .innerJoinAndSelect("g.carrera", "c")
                .innerJoinAndSelect("g.modulo", "m")
                .leftJoinAndSelect("g.secretaria", "s")
                .where("g.uuid=:uuid", { uuid })
                .getOne();

            if (!group) throw new DatabaseError("Grupo no encontrado", 404, "");

            const students = await this.listEstudents(group.uuid);
            return { ...group, students };
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

    public closeGroup = async (grupoUuid: string): Promise<Grupo> => {
        try {
            const grupo = await Grupo.findOneBy({ uuid: grupoUuid });
            if (!grupo) throw new NotFoundError("El grupo no existe");

            grupo.estado = ESTADO_GRUPO.CERRADO;
            await grupo.save();
            await grupo.reload();
            return grupo;
        } catch (error) {
            throw error;
        }
    };
}
