import { v4 as uuid } from "uuid";
import {
    Carrera,
    Grupo,
    Matricula,
    MatriculaGruposGrupo,
    TarifaPensionCarrera,
} from "../entity";
import { GroupDTO } from "../interfaces/dtos";
import { GroupRepository } from "../interfaces/repositories";
import { Horario } from "../entity/Horario.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity";
import {
    CONDICION_ALUMNO,
    ESTADO_GRUPO,
    TIPO_CARRERA,
} from "../../interfaces/enums";
import { PensionService } from "../../Pension/services/pension.service";
import { NotFoundError } from "../../errors/NotFoundError";
import { PagoPension, Pension } from "../../Pension/entity";
import { StudentService } from "../../Student/services/student.service";
import moment from "moment";
import { AppDataSource } from "../../db/dataSource";
import exceljs from "exceljs";
import { getDateFormatWH } from "../helpers/formatDate";
import { generateArrayByNumber } from "../helpers/generateArrayByNumber";

const pensionService = new PensionService();
const studentService = new StudentService(pensionService);

type StudentsWithPensionGrupo = {
    matriculaGrupo: MatriculaGruposGrupo;
    pensionGrupo: Pension;
};

type MatriculaWithObservaciones = {
    matricula: Matricula;
    observaciones: string;
};
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
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const grupo = await Grupo.findOne({
                where: { uuid: grupoUuid },
                relations: { horario: true, pensiones: true, carrera: true },
            });
            const secretaria = await Secretaria.findOneBy({
                uuid: secretariaUuid,
            });

            if (!grupo) throw new NotFoundError("El grupo no existe");
            if (!secretaria) throw new NotFoundError("La secretaria existe");

            const students = await Promise.all(
                matriculasUuid.map(async ({ matriculaUuid, observaciones }) => {
                    const matricula = await Matricula.createQueryBuilder("m")
                        .innerJoinAndSelect("m.carrera", "c")
                        .leftJoinAndSelect("m.matriculaGruposGrupo", "mgg")
                        .leftJoinAndSelect("m.ultimo_grupo", "ug")
                        .leftJoinAndSelect("ug.horario", "h")
                        .where("m.uuid=:matriculaUuid", { matriculaUuid })
                        .getOne();

                    if (matricula) return { matricula, observaciones };
                    else return undefined;
                })
            );

            const studentsArray = students.filter(
                (element): element is MatriculaWithObservaciones =>
                    element !== undefined
            );

            await Promise.all(
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
                            matricula.ultimo_grupo.estado ===
                            ESTADO_GRUPO.EN_CURSO
                        ) {
                            throw new DatabaseError(
                                "No se puede agregar a un alumno que se encuentra en un grupo abierto",
                                400,
                                "Not aceptable"
                            );
                        }
                        if (
                            matricula.ultimo_grupo.horario.uuid ===
                            grupo.horario.uuid
                        ) {
                            newMatriculaGrupo.condicion =
                                CONDICION_ALUMNO.CONTINUA;
                        } else {
                            newMatriculaGrupo.condicion =
                                CONDICION_ALUMNO.CAMBIO_HORARIO;
                        }

                        matricula.ultimo_grupo = grupo;
                    }

                    await queryRunner.manager.save(newMatriculaGrupo);

                    matricula.matriculaGruposGrupo.push(newMatriculaGrupo);

                    const pensiones = await this.generatePension(
                        matricula,
                        grupo
                    );

                    await Promise.all(
                        pensiones.map(async (pension) => {
                            await queryRunner.manager.save(pension);
                            grupo.pensiones.push(pension);
                        })
                    );

                    // const tarifaPension =
                    //     await TarifaPensionCarrera.createQueryBuilder("t")
                    //         .innerJoinAndSelect("t.carrera", "c")
                    //         .where("c.uuid=:uuid and t.modalidad=:modalidad", {
                    //             uuid: matricula.carrera.uuid,
                    //             modalidad: grupo.modalidad,
                    //         })
                    //         .getOne();

                    // const fechaLimite = moment(grupo.fecha_inicio)
                    //     .add(15, "days")
                    //     .toDate();
                    // const mesPension = fechaLimite.getMonth() + 1;

                    // const newPension = await pensionService.register({
                    //     matricula,
                    //     grupo,
                    //     monto: tarifaPension!.tarifa,
                    //     fechaLimite,
                    //     mes: mesPension,
                    // });

                    // await queryRunner.manager.save(newPension);
                    // grupo.pensiones.push(newPension);

                    await queryRunner.manager.save(grupo);
                    await queryRunner.manager.save(matricula);
                })
            );

            await queryRunner.manager.save(grupo);
            await grupo.reload();

            await queryRunner.commitTransaction();

            const studentsGrupo = await this.listEstudents(grupo.uuid);
            return studentsGrupo;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    };

    public generatePension = async (matricula: Matricula, grupo: Grupo) => {
        const { tipo_carrera } = grupo.carrera;
        const tarifaPension = await TarifaPensionCarrera.createQueryBuilder("t")
            .innerJoinAndSelect("t.carrera", "c")
            .where("c.uuid=:uuid and t.modalidad=:modalidad", {
                uuid: matricula.carrera.uuid,
                modalidad: grupo.modalidad,
            })
            .getOne();

        if (tipo_carrera === TIPO_CARRERA.MODULAR) {
            const fechaLimite = moment(grupo.fecha_inicio)
                .add(15, "days")
                .toDate();
            const mesPension = fechaLimite.getMonth() + 1;

            const newPension = await pensionService.register({
                matricula,
                grupo,
                monto: tarifaPension!.tarifa,
                fechaLimite,
                mes: mesPension,
            });

            return [newPension];
        } else {
            const NUMBER_PENSIONES = 4;

            let pensionesArray: number[] =
                generateArrayByNumber(NUMBER_PENSIONES);

            let fechaLimite: Date = moment(grupo.fecha_inicio)
                .add(15, "days")
                .toDate();

            let mesPension: number;

            const pensiones = await Promise.all(
                pensionesArray.map(async (_, i) => {
                    const newfechaLimite = moment(fechaLimite)
                        .add(i, "M")
                        .toDate();
                    const mes = i + 1;
                    mesPension =
                        fechaLimite.getMonth() + (mes > 12 ? mes - 12 : mes);

                    const newPension = await pensionService.register({
                        matricula,
                        grupo,
                        monto: tarifaPension!.tarifa,
                        fechaLimite: newfechaLimite,
                        mes: mesPension,
                    });

                    return newPension;
                })
            );

            return pensiones;
        }
    };

    public removeStudent = async (matriculaUuid: string, grupoUuid: string) => {
        try {
            const matriculaGrupo = await MatriculaGruposGrupo.findOne({
                where: {
                    matricula: { uuid: matriculaUuid },
                    grupo: { uuid: grupoUuid },
                },
            });

            if (!matriculaGrupo) {
                throw new Error("Este alumno no está en este grupo");
            }

            await MatriculaGruposGrupo.remove(matriculaGrupo);

            const pensionGrupo = await Pension.findOne({
                where: {
                    matricula: { uuid: matriculaUuid },
                    grupo: { uuid: grupoUuid },
                },
            });

            if (!pensionGrupo) {
                throw new Error(
                    "No se pudo encontrar la pensión de este alumno"
                );
            }
            await PagoPension.delete({ pension: { uuid: pensionGrupo.uuid } });

            await Pension.remove(pensionGrupo);

            return { msg: "Eliminado" };
        } catch (error) {
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
     * Servicio para obtener el listado de los alumnos matriculados con sus respectivas pensiones en un grupo
     * @param {string} uuid Uuid del grupo
     * @returns {Promise<StudentsWithPensionGrupo[]>} Listado de alumnos matriculados en el grupo
     */
    public listEstudents = async (
        uuid: string
    ): Promise<StudentsWithPensionGrupo[]> => {
        try {
            const grupo = await Grupo.findOneBy({ uuid });
            if (!grupo) throw new NotFoundError("Grupo no encontrado");

            const studentsByGrupo =
                await MatriculaGruposGrupo.createQueryBuilder("mg")
                    .innerJoinAndSelect("mg.matricula", "m")
                    .innerJoinAndSelect("mg.grupo", "g")
                    .innerJoinAndSelect("m.alumno", "a")
                    .innerJoinAndSelect("m.sede", "matse")
                    .leftJoinAndSelect("mg.responsable", "r")
                    .leftJoinAndSelect("r.sede", "s")
                    .leftJoinAndSelect("r.usuario", "u")
                    .where("g.uuid=:uuid", { uuid: grupo.uuid })
                    .getMany();

            const data = await Promise.all(
                studentsByGrupo.map(async (matriculaGrupo) => {
                    const pensionGrupo = await pensionService.findPensionGrupo(
                        matriculaGrupo.matricula.uuid,
                        grupo.uuid
                    );

                    return {
                        matriculaGrupo,
                        pensionGrupo,
                    };
                })
            );

            return data;
        } catch (error) {
            throw error;
        }
    };

    public exportStudentsList = async (
        grupoUuid: string
    ): Promise<{ workbook: exceljs.Workbook; nombreArchivo: string }> => {
        try {
            const grupo = await Grupo.findOne({
                where: { uuid: grupoUuid },
                relations: {
                    carrera: true,
                    modulo: true,
                    docente: true,
                    horario: true,
                },
            });
            if (!grupo) throw new NotFoundError("El grupo no existe");

            const data = await this.listEstudents(grupoUuid);

            const { docente, modulo, carrera, horario } = grupo;
            const { ape_materno, ape_paterno, nombres } = docente;

            let workbook = new exceljs.Workbook();
            const sheet = workbook.addWorksheet();

            //Configuracion de columnas
            sheet.getColumn("A").width = 4;
            sheet.getColumn("B").width = 26;
            sheet.getColumn("C").width = 9;
            sheet.getColumn("D").width = 12;
            sheet.getColumn("E").width = 15;
            sheet.getColumn("F").width = 15;
            sheet.getColumn("G").width = 15;
            sheet.getColumn("H").width = 30;
            sheet.getColumn("I").width = 10;
            sheet.getColumn("J").width = 8;
            sheet.getColumn("K").width = 8;
            sheet.getColumn("L").width = 17;
            sheet.getColumn("M").width = 10;

            //Definiendo estilos
            const borderStyle: Partial<exceljs.Borders> = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            const centerAlignment: Partial<exceljs.Alignment> = {
                vertical: "middle",
                horizontal: "center",
            };

            const colorFillCell = (color: string): exceljs.Fill => ({
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: color },
            });

            sheet.mergeCells("A1:E3");
            const nombreCarreraCell = sheet.getCell("A1");
            nombreCarreraCell.value = carrera.nombre.toUpperCase();
            nombreCarreraCell.alignment = centerAlignment;
            nombreCarreraCell.border = borderStyle;
            nombreCarreraCell.fill = colorFillCell("ECB938");
            nombreCarreraCell.font = {
                bold: true,
                size: 16,
            };

            sheet.mergeCells("F1:G1");
            const nombreModuloLabel = sheet.getCell("F1");
            const nombreModuloCell = sheet.getCell("H1");
            nombreModuloLabel.value = "MODULO";
            nombreModuloLabel.border = borderStyle;
            nombreModuloLabel.alignment = centerAlignment;
            nombreModuloLabel.fill = colorFillCell("F7E0A7");
            nombreModuloCell.value = modulo.nombre.toUpperCase();
            nombreModuloCell.border = borderStyle;
            nombreModuloCell.font = {
                bold: true,
            };

            sheet.mergeCells("F2:G2");
            const nombreDocenteLabel = sheet.getCell("F2");
            const nombreDocenteCell = sheet.getCell("H2");

            nombreDocenteLabel.value = "DOCENTE";
            nombreDocenteLabel.border = borderStyle;
            nombreDocenteLabel.alignment = centerAlignment;
            nombreDocenteLabel.fill = colorFillCell("F7E0A7");
            nombreDocenteCell.value =
                `${ape_paterno} ${ape_materno} ${nombres}`.toUpperCase();
            nombreDocenteCell.border = borderStyle;

            sheet.mergeCells("F3:G3");
            const fechaInicioLabel = sheet.getCell("F3");
            const fechaInicioCell = sheet.getCell("H3");
            fechaInicioLabel.value = "INICIO";
            fechaInicioLabel.border = borderStyle;
            fechaInicioLabel.alignment = centerAlignment;
            fechaInicioLabel.fill = colorFillCell("F7E0A7");
            fechaInicioCell.value = getDateFormatWH(grupo.fecha_inicio);
            fechaInicioCell.border = borderStyle;

            sheet.mergeCells("F4:G4");
            const horarioLabel = sheet.getCell("F4");
            const horarioCell = sheet.getCell("H4");
            horarioLabel.value = "HORARIO";
            horarioLabel.border = borderStyle;
            horarioLabel.alignment = centerAlignment;
            horarioLabel.fill = colorFillCell("F7E0A7");
            horarioCell.value = `${horario.hora_inicio} - ${horario.hora_fin}`;
            horarioCell.border = borderStyle;

            //Cabeceras de la tabla principal
            sheet.mergeCells("A6:G6");
            sheet.getCell("A6").value = "DATOS DEL ALUMNO";
            sheet.getCell("A6").border = borderStyle;
            sheet.getCell("A6").fill = colorFillCell("ECB938");
            sheet.getCell("A6").alignment = centerAlignment;
            sheet.getCell("A6").font = {
                bold: true,
                size: 14,
            };

            sheet.mergeCells("H6:M6");
            sheet.getCell("H6").value = "DATOS DEL PAGO";
            sheet.getCell("H6").border = borderStyle;
            sheet.getCell("H6").fill = colorFillCell("ECB938");
            sheet.getCell("H6").alignment = centerAlignment;
            sheet.getCell("H6").font = {
                bold: true,
                size: 14,
            };

            let initialRowPosition: number = 7;
            let orden: number = 1;

            sheet.insertRow(initialRowPosition++, [
                "Nro",
                "APELLIDOS Y NOMBRES",
                "DNI",
                "N° CELULAR",
                "SEDE",
                "CONDICION",
                "OBS.",
                "COD. BOUCHER",
                "FECHA",
                "HORA",
                "MONTO",
                "FORMA DE PAGO",
                "ENTIDAD",
            ]);

            [
                "A7",
                "B7",
                "C7",
                "D7",
                "E7",
                "F7",
                "G7",
                "H7",
                "I7",
                "J7",
                "K7",
                "L7",
                "M7",
            ].map((cell) => {
                sheet.getCell(cell).fill = colorFillCell("F7E0A7");
                sheet.getCell(cell).font = {
                    bold: true,
                    size: 11,
                };
                sheet.getCell(cell).border = {
                    left: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            const mappedCondicion = {
                nuevo: "NUEVO",
                continua: "CONTINUA",
                cambio_horario: "C. D. HORARIO",
            };

            data.map(({ matriculaGrupo, pensionGrupo }) => {
                const { matricula, condicion, observacion } = matriculaGrupo;
                const { pago_pensiones } = pensionGrupo;

                const { alumno, sede } = matricula;
                const nombreCompleto = `${alumno.ape_materno} ${alumno.ape_materno} ${alumno.nombres}`;

                if (pago_pensiones.length > 1) {
                    return pago_pensiones.map((p, i) => {
                        if (i === 0) {
                            sheet.insertRow(initialRowPosition++, [
                                orden++,
                                nombreCompleto,
                                alumno.dni,
                                alumno.celular,
                                sede.nombre,
                                mappedCondicion[condicion],
                                observacion,
                                p.num_comprobante || "-",
                                getDateFormatWH(p.fecha) || "-",
                                p.hora || "-",
                                `S/. ${p.monto}` || "-",
                                p.forma_pago.description || "-",
                                p.entidad || "-",
                            ]);
                        } else {
                            sheet.insertRow(initialRowPosition++, [
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                                "",
                                p.num_comprobante || "-",
                                getDateFormatWH(p.fecha) || "-",
                                p.hora || "-",
                                `S/. ${p.monto}` || "-",
                                p.forma_pago.description || "-",
                                p.entidad || "-",
                            ]);
                        }
                    });
                }

                sheet.insertRow(initialRowPosition++, [
                    orden++,
                    nombreCompleto,
                    alumno.dni,
                    alumno.celular,
                    sede.nombre,
                    mappedCondicion[condicion],
                    observacion,
                    pago_pensiones[0]?.num_comprobante || "-",
                    pago_pensiones[0]?.fecha
                        ? getDateFormatWH(pago_pensiones[0].fecha)
                        : "-",
                    pago_pensiones[0]?.hora || "-",
                    `S/. ${pago_pensiones[0]?.monto || "-"}`,
                    pago_pensiones[0]?.forma_pago.description || "-",
                    pago_pensiones[0]?.entidad || "-",
                ]);
            });

            return { workbook, nombreArchivo: grupo.nombre };
        } catch (error) {
            throw error;
        }
    };

    public listPensionesGrupo = async (grupoUuid: string) => {
        try {
            const students = await MatriculaGruposGrupo.createQueryBuilder(
                "mgg"
            )
                .innerJoinAndSelect("mgg.matricula", "m")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("mgg.grupo", "g")
                .innerJoinAndSelect("mgg.responsable", "r")
                .where("g.uuid=:grupoUuid", { grupoUuid })
                .getMany();

            const data = await Promise.all(
                students.map(async (e) => {
                    const pension = await Pension.createQueryBuilder("p")
                        .innerJoinAndSelect("p.matricula", "m")
                        .innerJoinAndSelect("p.grupo", "g")
                        .where("m.uuid=:matriculaUuid and g.uuid=:grupoUuid", {
                            matriculaUuid: e.matricula.uuid,
                            grupoUuid,
                        })
                        .getOne();

                    if (!pension)
                        throw new NotFoundError("La pension no existe");

                    return {
                        matricula: e,
                        pension,
                    };
                })
            );

            return data;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<any> => {
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
            const grupo = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.modulo", "m")
                .innerJoinAndSelect("g.horario", "h")
                .innerJoinAndSelect("g.matriculaGruposGrupo", "mgg")
                .leftJoinAndSelect("mgg.matricula", "ma")
                .where("g.uuid=:grupoUuid", { grupoUuid })
                .getOne();

            if (!grupo) throw new NotFoundError("El grupo no existe");

            grupo.estado = ESTADO_GRUPO.CERRADO;
            grupo.matriculaGruposGrupo.map(async (m) => {
                await studentService.updateMatriculaModulos(
                    m.matricula.uuid,
                    grupo.modulo.uuid,
                    grupo
                );
            });

            await grupo.save();
            await grupo.reload();
            return grupo;
        } catch (error) {
            throw error;
        }
    };
}
