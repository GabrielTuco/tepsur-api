import { v4 as uuid } from "uuid";
import fileUpload from "express-fileupload";
import moment from "moment";
import {
    Carrera,
    Grupo,
    Horario,
    Matricula,
    MatriculaGruposGrupo,
    MetodoPago,
    Modulo,
    PagoMatricula,
    TarifaPensionCarrera,
} from "../entity";
import {
    MatriculaDTO,
    PagoMatriculaData,
    ModuloMatriculaDTO,
    TrasladoMatriculaDTO,
} from "../interfaces/dtos";
import { MatriculaRepository } from "../interfaces/repositories";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { uploadImage } from "../../helpers/uploadImage";
import { AppDataSource } from "../../db/dataSource";
import { PensionService } from "../../Pension/services/pension.service";
import { MatriculaModulosModulo } from "../entity/MatriculaModulosModulo";
import {
    CONDICION_ALUMNO,
    ESTADO_MODULO_MATRICULA,
    MODALIDAD,
    TIPO_CARRERA,
    TIPO_MATRICULA,
} from "../../interfaces/enums";
import { StudentService } from "../../Student/services/student.service";
import { Alumno } from "../../Student/entity";
import { MatriculaEspecializacion } from "../../Especializacion/entity/MatriculaEspecializacion.entity";
import { Pension } from "../../Pension/entity";

const pensionService = new PensionService();
const studentService = new StudentService();
export class MatriculaService implements MatriculaRepository {
    public register = async (data: MatriculaDTO): Promise<Matricula> => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const {
                alumno,
                carreraUuid,
                fechaInicio,
                fechaInscripcion,
                modulos,
                pagoMatricula,
                secretariaUuid,
                sedeUuid,
                tipoMatricula,
            } = data;
            let newAlumno: Alumno;

            const alumnoAlreadyExists = await Alumno.findOneBy({
                dni: alumno.dni,
            });
            if (!alumnoAlreadyExists) {
                //Registro de datos personales del estudiante
                const newDireccion =
                    await studentService.registerAddressStudent(
                        alumno.direccion
                    );
                await queryRunner.manager.save(newDireccion);

                const newUser = await studentService.registerUserStudent(
                    alumno.dni
                );
                await queryRunner.manager.save(newUser);

                newAlumno = await studentService.registerStudent(
                    alumno,
                    newDireccion,
                    newUser
                );
                await queryRunner.manager.save(newAlumno);
            } else {
                newAlumno = alumnoAlreadyExists;
            }

            //Registro de datos academicos del estudiante
            const secretaria = await Secretaria.findOneBy({
                uuid: secretariaUuid,
            });
            const carrera = await Carrera.findOne({
                where: { uuid: carreraUuid },
                relations: { modulos: true },
            });
            const sede = await Sede.findOne({
                where: { uuid: sedeUuid },
                relations: { carreras: true },
            });

            const carreraValid = sede?.carreras.find(
                (c) => c.uuid === carrera?.uuid
            );
            if (!carreraValid)
                throw new DatabaseError(
                    "Esta carrera no se puede llevar en esta sede",
                    400,
                    "Refused error"
                );

            const newMatricula = new Matricula();
            newMatricula.uuid = uuid();
            newMatricula.carrera = carrera!;
            newMatricula.alumno = newAlumno;
            newMatricula.secretaria = secretaria!;
            newMatricula.sede = sede!;
            newMatricula.fecha_inscripcion = fechaInscripcion;
            newMatricula.fecha_inicio = fechaInicio;
            newMatricula.tipo_matricula = tipoMatricula;

            await queryRunner.manager.save(newMatricula);

            if (pagoMatricula) {
                const newPagoMatricula = new PagoMatricula();
                const metodoPago = await MetodoPago.findOneBy({
                    uuid: pagoMatricula.formaPagoUuid,
                });
                newPagoMatricula.uuid = uuid();
                newPagoMatricula.num_comprobante = pagoMatricula.numComprobante;
                newPagoMatricula.forma_pago = metodoPago!;
                newPagoMatricula.monto = pagoMatricula.monto;
                await queryRunner.manager.save(newPagoMatricula);

                newMatricula.pagoMatricula = newPagoMatricula;
            }

            if (carrera?.tipo_carrera === TIPO_CARRERA.MODULAR) {
                //Busqueda de modulos
                const modulosExists = await Promise.all(
                    modulos.map(
                        async ({ uuid }) => await Modulo.findOneBy({ uuid })
                    )
                );

                //Eliminacion de posibles nulos
                const newModulosToMatricula = modulosExists.filter(
                    (element): element is Modulo => element !== null
                );

                //Array de objetos con los modulos y propiedades adicionales
                const newModulosToMatriculaWithCustomProperties =
                    await Promise.all(
                        newModulosToMatricula.map(async (modulo, i) => {
                            const horario = await Horario.findOneBy({
                                uuid: modulos[i].horarioUuid,
                            });
                            return {
                                modulo,
                                horario,
                                modalidad: modulos[i].modalidad,
                                fechaInicio: modulos[i].fechaInicio,
                            };
                        })
                    );

                newMatricula.matriculaModulosModulo = await Promise.all(
                    newModulosToMatriculaWithCustomProperties.map(
                        async (modulo) => {
                            const matriculaModulo =
                                new MatriculaModulosModulo();
                            matriculaModulo.uuid = uuid();
                            matriculaModulo.matricula = newMatricula;
                            matriculaModulo.modulo = modulo.modulo;
                            matriculaModulo.modalidad = modulo.modalidad;
                            matriculaModulo.fecha_inicio = modulo.fechaInicio;
                            matriculaModulo.horario = modulo.horario!;
                            matriculaModulo.estado =
                                ESTADO_MODULO_MATRICULA.MATRICULADO;

                            await queryRunner.manager.save(matriculaModulo);
                            return matriculaModulo;
                        }
                    )
                );
                await queryRunner.manager.save(newMatricula);

                const totalModulosCarrera = carrera!.modulos;
                const modulosRestantes = totalModulosCarrera!.map((modulo) => {
                    const moduloExistsInArray = newModulosToMatricula.find(
                        (m) => m.uuid === modulo.uuid
                    );
                    if (!moduloExistsInArray) {
                        return modulo;
                    }
                });

                const modulosRestantesWithoutNulls = modulosRestantes!.filter(
                    (element): element is Modulo => element !== undefined
                );

                if (modulosRestantesWithoutNulls.length > 0) {
                    const modulosRestantesData = await Promise.all(
                        modulosRestantesWithoutNulls.map(async (modulo) => {
                            const matriculaModulo =
                                new MatriculaModulosModulo();
                            matriculaModulo.uuid = uuid();
                            matriculaModulo.matricula = newMatricula;
                            matriculaModulo.modulo = modulo;
                            matriculaModulo.estado =
                                ESTADO_MODULO_MATRICULA.POR_LLEVAR;
                            await queryRunner.manager.save(matriculaModulo);
                            return matriculaModulo;
                        })
                    );

                    newMatricula.matriculaModulosModulo = [
                        ...newMatricula.matriculaModulosModulo,
                        ...modulosRestantesData,
                    ];
                }
            } else {
                const [moduloData] = modulos;
                const horario = await Horario.findOneBy({
                    uuid: moduloData.horarioUuid,
                });

                const modulo = carrera?.modulos.find((m) => m.orden === 1);
                const matriculaModulo = new MatriculaModulosModulo();
                matriculaModulo.uuid = uuid();
                matriculaModulo.matricula = newMatricula;
                matriculaModulo.modulo = modulo!;
                matriculaModulo.horario = horario!;
                matriculaModulo.modalidad = moduloData.modalidad;
                matriculaModulo.fecha_inicio = moduloData.fechaInicio;
                matriculaModulo.estado = ESTADO_MODULO_MATRICULA.MATRICULADO;

                await queryRunner.manager.save(matriculaModulo);
                newMatricula.matriculaModulosModulo = [matriculaModulo];

                await queryRunner.manager.save(newMatricula);

                const totalModulosCarrera = carrera!.modulos;
                const modulosRestantes = totalModulosCarrera.filter(
                    (m) => m.uuid !== modulo?.uuid
                );

                if (modulosRestantes.length > 0) {
                    const modulosRestantesData = await Promise.all(
                        modulosRestantes.map(async (modulo) => {
                            const matriculaModulo =
                                new MatriculaModulosModulo();
                            matriculaModulo.uuid = uuid();
                            matriculaModulo.matricula = newMatricula;
                            matriculaModulo.modulo = modulo;
                            matriculaModulo.estado =
                                ESTADO_MODULO_MATRICULA.POR_LLEVAR;
                            await queryRunner.manager.save(matriculaModulo);
                            return matriculaModulo;
                        })
                    );

                    newMatricula.matriculaModulosModulo = [
                        ...newMatricula.matriculaModulosModulo,
                        ...modulosRestantesData,
                    ];
                }
            }

            await queryRunner.manager.save(newMatricula);

            //Registrar pensiones por cada modulo matriculado
            await this.registerPensiones(newMatricula, carreraUuid);

            await queryRunner.commitTransaction();

            return newMatricula;
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    };

    public trasladoAlumno = async (
        data: TrasladoMatriculaDTO
    ): Promise<Matricula> => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const {
                alumno,
                carreraUuid,
                fechaInicio,
                grupoUuid,
                modulosCompletados,
                pagoMatricula,
                secretariaUuid,
                sedeUuid,
            } = data;

            //Registro de datos personales del estudiante
            const newDireccion = await studentService.registerAddressStudent(
                alumno.direccion
            );
            await queryRunner.manager.save(newDireccion);

            const newUser = await studentService.registerUserStudent(
                alumno.dni
            );
            await queryRunner.manager.save(newUser);

            const newAlumno = await studentService.registerStudent(
                alumno,
                newDireccion,
                newUser
            );
            await queryRunner.manager.save(newAlumno);

            //Registro de datos academicos del estudiante
            const secretaria = await Secretaria.findOneBy({
                uuid: secretariaUuid,
            });
            const carrera = await Carrera.findOneBy({ uuid: carreraUuid });
            const sede = await Sede.findOne({
                where: { uuid: sedeUuid },
                relations: { carreras: true },
            });

            const carreraValid = sede?.carreras.find(
                (c) => c.uuid === carrera?.uuid
            );
            if (!carreraValid)
                throw new Error("Esta carrera no se puede llevar en esta sede");

            const newMatricula = new Matricula();
            newMatricula.uuid = uuid();
            newMatricula.carrera = carrera!;
            newMatricula.alumno = newAlumno;
            newMatricula.secretaria = secretaria!;
            newMatricula.sede = sede!;
            newMatricula.fecha_inscripcion = new Date();
            newMatricula.fecha_inicio = fechaInicio;
            newMatricula.tipo_matricula = TIPO_MATRICULA.NUEVO;

            await queryRunner.manager.save(newMatricula);

            //TODO: Validar que los modulos pertenecen a la carrera

            const newPagoMatricula = new PagoMatricula();
            const metodoPago = await MetodoPago.findOneBy({
                uuid: pagoMatricula.formaPagoUuid,
            });
            newPagoMatricula.uuid = uuid();
            newPagoMatricula.num_comprobante = pagoMatricula.numComprobante;
            newPagoMatricula.forma_pago = metodoPago!;
            newPagoMatricula.monto = pagoMatricula.monto;
            await queryRunner.manager.save(newPagoMatricula);

            newMatricula.pagoMatricula = newPagoMatricula;

            modulosCompletados.map(async (m) => {
                const matriculaModulo = new MatriculaModulosModulo();
                matriculaModulo.modulo = (await Modulo.findOneBy({
                    uuid: m,
                })) as Modulo;
                matriculaModulo.estado = ESTADO_MODULO_MATRICULA.CULMINADO;

                await queryRunner.manager.save(matriculaModulo);
            });

            const matriculaGrupo = new MatriculaGruposGrupo();
            matriculaGrupo.matricula = newMatricula;
            matriculaGrupo.grupo = (await Grupo.findOneBy({
                uuid: grupoUuid,
            })) as Grupo;
            matriculaGrupo.condicion = CONDICION_ALUMNO.NUEVO;

            await queryRunner.manager.save(matriculaGrupo);

            await queryRunner.manager.save(newMatricula);

            await queryRunner.commitTransaction();

            return newMatricula;
        } catch (error) {
            console.log(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    };

    public registerPensiones = async (
        matricula: Matricula,
        carreraUuid: string
    ): Promise<void> => {
        try {
            const fechaInicio = new Date(matricula.fecha_inicio);
            const mesInicio = fechaInicio.getMonth() + 1;
            let numeroDePensiones = matricula.carrera.duracion_meses;
            const fechaFin = moment().add(numeroDePensiones, "M").toDate();
            const meses: { mes: number; fechaLimite: Date }[] = [];
            const modulosMatriculadosLength =
                matricula.matriculaModulosModulo.length;

            const tarifa = await TarifaPensionCarrera.createQueryBuilder("t")
                .innerJoinAndSelect("t.carrera", "c")
                .where("c.uuid=:uuid", { uuid: carreraUuid })
                .getOne();
            if (!tarifa)
                throw new DatabaseError(
                    "No existe una tarifa registrada para esta carrera",
                    404,
                    "Not found error"
                );
            const tarifaPension = tarifa.tarifa;

            const yearDifference =
                fechaFin.getFullYear() - fechaInicio.getFullYear();

            //Registro de pension de los modulos matriculados
            for (let i = 1; i <= modulosMatriculadosLength; i++) {
                meses.push({
                    mes: mesInicio,
                    fechaLimite: new Date(),
                });
            }
            //Reducimos el numero de pensiones de acuerdo a los modulos ya matriculados para el primer mes
            numeroDePensiones = numeroDePensiones - modulosMatriculadosLength;

            for (let i = 1; i <= numeroDePensiones; i++) {
                if (mesInicio + i > 12)
                    meses.push({
                        mes: mesInicio + i - 12 * yearDifference,
                        fechaLimite: new Date(),
                    });
                else
                    meses.push({ mes: mesInicio + i, fechaLimite: new Date() });
            }

            meses.map(async ({ mes, fechaLimite }) => {
                const pension = await pensionService.register({
                    matricula,
                    mes,
                    fechaLimite,
                    monto: tarifaPension,
                });
                return pension;
            });
        } catch (error) {
            throw error;
        }
    };

    public setRandomGroup = async (horarioUuid: string): Promise<Grupo> => {
        try {
            const grupos = await Grupo.createQueryBuilder("g")
                .innerJoinAndSelect("g.horario", "h")
                .where("h.uuid=:id", { id: horarioUuid })
                .getMany();

            const gruposDisponibles: string[] = [];
            grupos.map(async (g) => {
                const alumnosMatriculados = await Matricula.createQueryBuilder(
                    "m"
                )
                    .innerJoin("m.grupo", "g")
                    .where("g.uuid=:id", { id: g.uuid })
                    .getCount();

                if (alumnosMatriculados < g.cupos_maximos) {
                    gruposDisponibles.push(g.uuid);
                }
            });

            const arrPos = Math.floor(Math.random() * gruposDisponibles.length);
            const grupo = await Grupo.findOneBy({
                uuid: gruposDisponibles[arrPos],
            });

            return grupo!;
        } catch (error) {
            throw error;
        }
    };

    public setModulesForMatricula = async (
        matriculaUuid: string,
        modulosMatricula: ModuloMatriculaDTO[]
    ): Promise<Matricula> => {
        try {
            const matricula = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.carrera", "c")
                .innerJoinAndSelect("c.modulos", "m")
                .innerJoinAndSelect("m.matriculaModulosMatricula", "mm")
                .where("m.uuid=:uuid", { uuid: matriculaUuid })
                .getOne();

            if (!matricula)
                throw new DatabaseError("Matricula not found", 500, "");

            //Busqueda de modulos
            const modulosExists = await Promise.all(
                modulosMatricula.map(
                    async ({ uuid }) => await Modulo.findOneBy({ uuid })
                )
            );

            //Eliminacion de posibles nulos
            const newModulosToMatricula = modulosExists.filter(
                (element): element is Modulo => element !== null
            );

            //Validar si todos los modulos a registrar pertenecen a la carrera
            const isModulosValid = newModulosToMatricula.every((m1) => {
                return matricula.carrera.modulos.every(
                    (m2) => m1.uuid === m2.uuid
                );
            });

            if (!isModulosValid)
                throw new Error(
                    "Algunos modulos no pertenecen a la carrera en la que se matriculo el alumno"
                );

            //Array de objetos con los modulos y propiedades adicionales
            const newModulosToMatriculaWithCustomProperties =
                newModulosToMatricula.map((modulo, i) => {
                    return {
                        modulo,
                        modalidad: modulosMatricula[i].modalidad,
                        fechaInicio: modulosMatricula[i].fechaInicio,
                    };
                });

            matricula.matriculaModulosModulo = await Promise.all(
                newModulosToMatriculaWithCustomProperties.map(
                    async (modulo) => {
                        const matriculaModulo = new MatriculaModulosModulo();
                        matriculaModulo.matricula = matricula;
                        matriculaModulo.modulo = modulo.modulo;
                        matriculaModulo.modalidad = modulo.modalidad;
                        matriculaModulo.fecha_inicio = modulo.fechaInicio;
                        matriculaModulo.estado =
                            ESTADO_MODULO_MATRICULA.MATRICULADO;

                        await matriculaModulo.save();
                        return matriculaModulo;
                    }
                )
            );

            await matricula.save();
            await matricula.reload();

            return matricula;
        } catch (error) {
            throw error;
        }
    };

    public getAll = async (
        year: string | undefined,
        month: string | undefined
    ): Promise<Matricula[]> => {
        try {
            const matriculas = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.carrera", "c")
                .innerJoinAndSelect("m.alumno", "a")
                .leftJoinAndSelect("m.matriculaModulosModulo", "mm")
                .leftJoinAndSelect("mm.modulo", "mo")
                .leftJoinAndSelect("mm.horario", "h")
                .innerJoinAndSelect("a.grado_estudios", "ge")
                .innerJoinAndSelect("m.secretaria", "sc")
                .innerJoinAndSelect("a.direccion", "d")
                .innerJoinAndSelect("m.sede", "s")
                .leftJoinAndSelect("m.pagoMatricula", "p")
                .leftJoinAndSelect("p.forma_pago", "fp")
                .where(
                    `EXTRACT(YEAR from m.fecha_inscripcion)=:year ${
                        month
                            ? "and EXTRACT(MONTH from m.fecha_inscripcion)=:month "
                            : ""
                    }`,
                    // and mm.estado='matriculado
                    { year, month }
                )
                .getMany();

            return matriculas;
        } catch (error) {
            throw error;
        }
    };

    //Subida del documento de pago de matricula
    public uploadPaidDocument = async (
        uuid: string,
        image: fileUpload.UploadedFile
    ): Promise<Matricula | MatriculaEspecializacion> => {
        try {
            let pagoMatricula: PagoMatricula;
            let matricula: Matricula | MatriculaEspecializacion | null;

            matricula = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.pagoMatricula", "p")
                .where("m.uuid=:uuid", { uuid })
                .getOne();
            if (!matricula) {
                matricula = await MatriculaEspecializacion.createQueryBuilder(
                    "m"
                )
                    .innerJoinAndSelect("m.pagoMatricula", "p")
                    .where("m.uuid=:uuid", { uuid })
                    .getOne();
                if (!matricula)
                    throw new DatabaseError(
                        "La matricula no existe",
                        404,
                        "Not found error"
                    );
            }

            pagoMatricula = matricula.pagoMatricula;

            pagoMatricula.foto_comprobante = await uploadImage(
                pagoMatricula.foto_comprobante,
                image,
                "pagos-matricula"
            );
            await pagoMatricula.save();
            await pagoMatricula.reload();
            return matricula;
        } catch (error) {
            throw error;
        }
    };

    //Registro de pago de matricula
    public updatePagoMatricula = async (
        matriculaUuid: string,
        data: PagoMatriculaData
    ): Promise<PagoMatricula> => {
        try {
            const matricula = await Matricula.findOne({
                where: {
                    uuid: matriculaUuid,
                },
                relations: { pagoMatricula: true },
            });

            if (!matricula)
                throw new DatabaseError(
                    "La matricula no existe",
                    404,
                    "Not found error"
                );

            const newPagoMatricula = new PagoMatricula();
            const metodoPago = await MetodoPago.findOneBy({
                uuid: data.formaPagoUuid,
            });
            newPagoMatricula.uuid = uuid();
            newPagoMatricula.num_comprobante = data.numComprobante;
            newPagoMatricula.forma_pago = metodoPago!;
            newPagoMatricula.monto = data.monto;
            await newPagoMatricula.save();

            matricula.pagoMatricula = newPagoMatricula;

            await matricula.save();
            return newPagoMatricula;
        } catch (error) {
            throw error;
        }
    };

    public listModules = async (): Promise<Modulo[]> => {
        try {
            const modules = await Modulo.find();

            return modules;
        } catch (error) {
            throw error;
        }
    };

    public matriculaDataForPDF = async (uuid: string): Promise<any> => {
        try {
            const data = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.carrera", "c")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("a.direccion", "d")
                .innerJoinAndSelect("a.grado_estudios", "ge")
                .innerJoinAndSelect("m.sede", "s")
                .leftJoinAndSelect("m.pagoMatricula", "p")
                .leftJoinAndSelect("p.forma_pago", "f")
                .where(`m.uuid= :uuid`, { uuid })
                .getOne();

            const matriculaModulosModulo =
                await MatriculaModulosModulo.createQueryBuilder("mm")
                    .innerJoinAndSelect("mm.modulo", "mo")
                    .innerJoin("mm.matricula", "ma")
                    .innerJoinAndSelect("mm.horario", "h")
                    .where("ma.uuid=:uuid", { uuid: data?.uuid })
                    .getMany();

            if (!data)
                throw new DatabaseError(
                    "La matricula no existe",
                    404,
                    "Not found error"
                );

            return { ...data, matriculaModulosModulo };
        } catch (error) {
            throw error;
        }
    };

    public update = async (
        _uuid: string,
        _data: Partial<MatriculaDTO>
    ): Promise<Matricula> => {
        throw new Error("Method not implemented.");
    };

    public findByQuery = async (query: string): Promise<Matricula[]> => {
        try {
            const matriculas = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.alumno", "a")
                .leftJoinAndSelect("m.pagoMatricula", "pm")
                .leftJoinAndSelect("pm.forma_pago", "fp")
                .where(
                    `LOWER(a.dni) LIKE '%' || :query || '%'
                    OR LOWER(a.nombres) LIKE '%' || :query || '%'
                    OR LOWER(a.ape_paterno) LIKE '%' || :query || '%'
                    OR LOWER(a.ape_materno) LIKE '%' || :query || '%'
                    AND m.estado='true'`,
                    { query: query.toLowerCase() }
                )
                .getMany();

            return matriculas;
        } catch (error) {
            throw error;
        }
    };

    public findByStudent = async (_uuid: number): Promise<Matricula> => {
        throw new Error("Method not implemented.");
    };

    public findByUuid = async (
        uuid: string
    ): Promise<{ matricula: Matricula; pensiones: Pension[] }> => {
        try {
            const matricula = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.carrera", "c")
                .innerJoinAndSelect("m.alumno", "a")
                .leftJoinAndSelect("m.matriculaModulosModulo", "mm")
                .leftJoinAndSelect("mm.modulo", "mo")
                .leftJoinAndSelect("mm.horario", "h")
                .innerJoinAndSelect("a.grado_estudios", "ge")
                .innerJoinAndSelect("m.secretaria", "sc")
                .innerJoinAndSelect("a.direccion", "d")
                .innerJoinAndSelect("m.sede", "s")
                .leftJoinAndSelect("m.pagoMatricula", "p")
                .leftJoinAndSelect("p.forma_pago", "fp")
                .where("m.uuid=:uuid", { uuid })
                .getOne();

            if (!matricula)
                throw new DatabaseError(
                    "La matricula no existe",
                    404,
                    "Not found error"
                );

            const { pensiones } = await pensionService.listPensionByDni(
                matricula.alumno.dni
            );

            return { matricula, pensiones };
        } catch (error) {
            throw error;
        }
    };

    public delete = async (_uuid: string): Promise<Matricula> => {
        throw new Error("Method not implemented.");
    };

    public changeSede = async (
        _matriculaUuid: string,
        _sedeUuid: string
    ): Promise<Matricula> => {
        throw new Error("Method not implemented.");
    };
    public changeModalidadModulo = async (
        matriculaUuid: string,
        _moduloUuid: string,
        _modalidad: MODALIDAD
    ): Promise<Matricula> => {
        try {
            const matricula = await Matricula.findOne({
                where: { uuid: matriculaUuid },
                //relations: { matriculaModulosMatricula: true },
            });

            if (!matricula)
                throw new DatabaseError("Matricula not found", 500, "");

            /*const modulo = matricula.matriculaModulosModulo.find(
        (m) => m.moduloUuid === moduloUuid
      );
      if (!modulo)
        throw new DatabaseError("Modulo not found in this matricula", 500, "");

      modulo.modalidad = modalidad;*/

            await matricula.save();
            await matricula.reload();

            return matricula;
        } catch (error) {
            throw error;
        }
    };
    public changeHorario = async (
        _matriculaUuid: string,
        _moduloUuid: string
    ): Promise<Matricula> => {
        throw new Error("Method not implemented.");
    };
}
