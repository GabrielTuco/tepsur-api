import { v4 as uuid } from "uuid";
import fileUpload from "express-fileupload";
import moment from "moment";
import {
    Carrera,
    Horario,
    Matricula,
    MetodoPago,
    Modulo,
    PagoMatricula,
    TarifaPensionCarrera,
} from "../entity";
import {
    MatriculaDTO,
    PagoMatriculaData,
    ModuloMatriculaDTO,
    UpdateMatriculaDto,
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
    ESTADO_MODULO_MATRICULA,
    MODALIDAD,
    TIPO_CARRERA,
    TIPO_MATRICULA,
} from "../../interfaces/enums";
import { StudentService } from "../../Student/services/student.service";
import { Alumno } from "../../Student/entity";
import { MatriculaEspecializacion } from "../../Especializacion/entity/MatriculaEspecializacion.entity";
import { Pension } from "../../Pension/entity";
import { NotFoundError } from "../../errors/NotFoundError";
import { AlreadyExistsError } from "../../errors/AlreadyExistsError";
import { RegisterImportarMatriculaDto } from "../dto/registerImportarMatriculaDto";
import { Direccion } from "../../entity";

const pensionService = new PensionService();
const studentService = new StudentService(pensionService);
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

            const isMatriculaInSameCareer = await Matricula.createQueryBuilder(
                "m"
            )
                .innerJoin("m.alumno", "a")
                .innerJoin("m.carrera", "c")
                .where("a.uuid=:alumno and c.uuid=:carrera", {
                    alumno: newAlumno.uuid,
                    carrera: carreraUuid,
                })
                .getOne();

            if (isMatriculaInSameCareer) {
                throw new AlreadyExistsError(
                    "Este alumno ya registra una matricula en esta carrera"
                );
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
                newPagoMatricula.fecha = pagoMatricula.fecha;
                newPagoMatricula.hora = pagoMatricula.hora;

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

                //Registrar modulo restante con estado por llevar
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

    public importarMatriculaExistente = async (
        data: RegisterImportarMatriculaDto
    ): Promise<Matricula> => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const {
                alumno,
                carreraUuid,
                fechaInicio,
                modulosCompletados,
                pagoMatricula,
                secretariaUuid,
                sedeUuid,
            } = data;

            //Registro de datos personales del estudiante
            let newDireccion: Direccion | null = null;
            if (alumno.direccion) {
                newDireccion = await studentService.registerAddressStudent(
                    alumno.direccion
                );
                await queryRunner.manager.save(newDireccion);
            }

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
            newMatricula.fecha_inscripcion = new Date();
            newMatricula.fecha_inicio = fechaInicio;
            newMatricula.tipo_matricula = TIPO_MATRICULA.NUEVO;

            await queryRunner.manager.save(newMatricula);

            //TODO: Validar que los modulos pertenecen a la carrera

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

            const modulos = await Promise.all(
                modulosCompletados.map(async (mod) => {
                    const modulo = await Modulo.findOneBy({ uuid: mod });

                    const matriculaModulo = new MatriculaModulosModulo();
                    matriculaModulo.uuid = uuid();
                    matriculaModulo.matricula = newMatricula;
                    matriculaModulo.modulo = modulo!;
                    matriculaModulo.estado = ESTADO_MODULO_MATRICULA.CULMINADO;

                    await queryRunner.manager.save(matriculaModulo);
                    return matriculaModulo;
                })
            );
            newMatricula.matriculaModulosModulo = modulos;

            //Registrar modulo restante con estado por llevar
            const totalModulosCarrera = carrera!.modulos;
            const modulosRestantes = totalModulosCarrera!.map((modulo) => {
                const moduloExistsInArray = modulos.find(
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
                        const matriculaModulo = new MatriculaModulosModulo();
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

            await queryRunner.manager.save(newMatricula);

            await queryRunner.commitTransaction();

            const { matricula } = await this.findByUuid(newMatricula.uuid);

            return matricula;
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
        carreraUuid: string,
        modulosMatriculados: number
    ): Promise<void> => {
        try {
            const fechaInicio = new Date(matricula.fecha_inicio);
            const mesInicio = fechaInicio.getMonth() + 1;
            let numeroDePensiones = matricula.carrera.duracion_meses;
            const fechaFin = moment(fechaInicio)
                .add(numeroDePensiones, "M")
                .toDate();
            const meses: { mes: number; fechaLimite: Date }[] = [];
            const modulosMatriculadosLength = modulosMatriculados;

            const tarifa = await TarifaPensionCarrera.createQueryBuilder("t")
                .innerJoinAndSelect("t.carrera", "c")
                .where("c.uuid=:uuid", { uuid: carreraUuid })
                .getOne();
            if (!tarifa)
                throw new NotFoundError(
                    "No existe una tarifa registrada para esta carrera"
                );
            const tarifaPension = tarifa.tarifa;

            const yearDifference =
                fechaFin.getFullYear() - fechaInicio.getFullYear();

            if (modulosMatriculadosLength > 0) {
                //Registro de pension de los modulos matriculados
                for (let i = 1; i <= modulosMatriculadosLength; i++) {
                    meses.push({
                        mes: mesInicio,
                        fechaLimite: new Date(),
                    });
                }
                //Reducimos el numero de pensiones de acuerdo a los modulos ya matriculados para el primer mes
                numeroDePensiones =
                    numeroDePensiones - modulosMatriculadosLength;

                for (let i = 1; i <= numeroDePensiones; i++) {
                    if (mesInicio + i > 12)
                        meses.push({
                            mes: mesInicio + i - 12 * yearDifference,
                            fechaLimite: new Date(),
                        });
                    else
                        meses.push({
                            mes: mesInicio + i,
                            fechaLimite: new Date(),
                        });
                }
            } else {
                for (let i = 0; i <= numeroDePensiones; i++) {
                    if (mesInicio + i > 12)
                        meses.push({
                            mes: mesInicio + i - 12 * yearDifference,
                            fechaLimite: new Date(),
                        });
                    else
                        meses.push({
                            mes: mesInicio + i,
                            fechaLimite: new Date(),
                        });
                }
            }

            // meses.map(async ({ mes, fechaLimite }) => {
            //     const pension = await pensionService.register({
            //         matricula,
            //         mes,
            //         fechaLimite,
            //         monto: tarifaPension,
            //     });
            //     return pension;
            // });
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

            if (!matricula) throw new NotFoundError("La matricula no existe");

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
                .innerJoinAndSelect("sc.usuario", "u")
                .leftJoinAndSelect("sc.sede", "se")
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
                .orderBy("m.fecha_inscripcion", "DESC")
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
                    throw new NotFoundError("La matricula no existe");
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
            let matricula: Matricula | MatriculaEspecializacion | null;
            matricula = await Matricula.findOne({
                where: {
                    uuid: matriculaUuid,
                },
                relations: { pagoMatricula: true },
            });

            if (!matricula) {
                matricula = await MatriculaEspecializacion.findOne({
                    where: {
                        uuid: matriculaUuid,
                    },
                    relations: { pagoMatricula: true },
                });
                if (!matricula)
                    throw new NotFoundError("La matricula no existe");
            }

            const newPagoMatricula = new PagoMatricula();
            const metodoPago = await MetodoPago.findOneBy({
                uuid: data.formaPagoUuid,
            });
            newPagoMatricula.uuid = uuid();
            newPagoMatricula.num_comprobante = data.numComprobante;
            newPagoMatricula.forma_pago = metodoPago!;
            newPagoMatricula.monto = data.monto;
            newPagoMatricula.fecha = data.fecha;
            newPagoMatricula.hora = data.hora;
            newPagoMatricula.entidad = data.entidad;
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
            const modulos = await Modulo.createQueryBuilder("m")
                .innerJoinAndSelect("m.carrera", "c")
                .where("c.estado='activo'")
                .getMany();

            return modulos;
        } catch (error) {
            throw error;
        }
    };

    public matriculaDataForPDF = async (
        uuid: string
    ): Promise<Matricula | null> => {
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

            if (data) data!.matriculaModulosModulo = matriculaModulosModulo;

            return data;
        } catch (error) {
            throw error;
        }
    };

    public update = async (
        matriculaUuid: string,
        data: UpdateMatriculaDto
    ): Promise<Matricula> => {
        try {
            const { matricula } = await this.findByUuid(matriculaUuid);

            if (!matricula) throw new NotFoundError("La matricula no existe");

            matricula.alumno = await studentService.updateInfo(
                matricula.alumno.uuid,
                data.alumno
            );
            matricula.matriculaModulosModulo = await Promise.all(
                data.modulos.map(async (moduloData) => {
                    const matriculaModulo =
                        await MatriculaModulosModulo.createQueryBuilder("mm")
                            .innerJoin("mm.matricula", "ma")
                            .innerJoin("mm.modulo", "mo")
                            .innerJoin("mm.horario", "h")
                            .where("mm.uuid=:uuid", {
                                uuid: moduloData.uuid,
                            })
                            .getOne();
                    const horario = await Horario.findOneBy({
                        uuid: moduloData.horarioUuid,
                    });

                    if (!matriculaModulo) {
                        const newMatriculaModulo = new MatriculaModulosModulo();
                        const modulo = await Modulo.findOneBy({
                            uuid: moduloData.moduloUuid,
                        });
                        newMatriculaModulo.uuid = uuid();
                        newMatriculaModulo.modulo = modulo!;
                        newMatriculaModulo.matricula = matricula;
                        newMatriculaModulo.horario = horario!;
                        newMatriculaModulo.fecha_inicio =
                            moduloData.fechaInicio;
                        newMatriculaModulo.modalidad = moduloData.modalidad;
                        newMatriculaModulo.estado =
                            ESTADO_MODULO_MATRICULA.MATRICULADO;

                        await newMatriculaModulo.save();
                        return newMatriculaModulo;
                    }

                    matriculaModulo.horario = horario!;
                    matriculaModulo.fecha_inicio = moduloData.fechaInicio!;
                    matriculaModulo.modalidad = moduloData.modalidad!;

                    await matriculaModulo.save();

                    return matriculaModulo;
                })
            );

            await matricula.save();
            await matricula.reload();

            const savedMatricula = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("m.carrera", "c")
                .innerJoinAndSelect("m.matriculaModulosModulo", "mmm")
                .where("m.uuid=:matriculaUuid", { matriculaUuid })
                .getOne();

            console.log(JSON.stringify(savedMatricula, null, 4));

            return savedMatricula!;
        } catch (error) {
            throw error;
        }
    };

    public findByQuery = async (
        query: string
    ): Promise<{ matricula: Matricula; ultimoPago: Pension }[]> => {
        try {
            const matriculas = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("m.carrera", "c")
                .leftJoinAndSelect("m.pagoMatricula", "pm")
                .leftJoinAndSelect("pm.forma_pago", "fp")
                .leftJoinAndSelect("m.ultimo_grupo", "ug")
                .where(
                    `(LOWER(a.dni) LIKE '%' || :query || '%'
                    OR LOWER(a.nombres) LIKE '%' || :query || '%'
                    OR LOWER(a.ape_paterno) LIKE '%' || :query || '%'
                    OR LOWER(a.ape_materno) LIKE '%' || :query || '%')
                    AND m.estado=TRUE and (ug.estado='cerrado' or m.ultimo_grupo is null)`,
                    { query: query.toLowerCase() }
                )
                .getMany();

            const matriculas2 = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("m.carrera", "c")
                .leftJoinAndSelect("m.pagoMatricula", "pm")
                .leftJoinAndSelect("pm.forma_pago", "fp")
                .leftJoinAndSelect("m.ultimo_grupo", "ug")
                .where(
                    `LOWER(a.dni) LIKE '%' || :query || '%'
                    OR LOWER(a.nombres) LIKE '%' || :query || '%'
                    OR LOWER(a.ape_paterno) LIKE '%' || :query || '%'
                    OR LOWER(a.ape_materno) LIKE '%' || :query || '%'
                    AND m.estado=TRUE and ug.estado='cerrado'`,
                    { query: query.toLowerCase() }
                )
                .getQueryAndParameters();
            console.log(matriculas2);

            const data = await Promise.all(
                matriculas.map(async (m) => {
                    const ultimoPago = await pensionService.findUltimoPago(
                        m.uuid
                    );

                    return {
                        matricula: m,
                        ultimoPago,
                    };
                })
            );
            return data;
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
                .innerJoinAndSelect("sc.usuario", "u")
                .innerJoinAndSelect("a.direccion", "d")
                .innerJoinAndSelect("m.sede", "s")
                .leftJoinAndSelect("m.pagoMatricula", "p")
                .leftJoinAndSelect("p.forma_pago", "fp")
                .where("m.uuid=:uuid", { uuid })
                .getOne();

            console.log(matricula);

            if (!matricula) throw new NotFoundError("La matricula no existe");

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
