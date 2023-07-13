import { Response } from "express";
import { v4 as uuid } from "uuid";
import PDF from "pdfkit-table";
import fileUpload from "express-fileupload";
import moment from "moment";

import { Alumno } from "../../Student/entity/Alumno.entity";
import {
    Carrera,
    GradoEstudios,
    Grupo,
    Matricula,
    MatriculaGruposGrupo,
    MetodoPago,
    Modulo,
    PagoMatricula,
    TarifaPensionCarrera,
} from "../entity";
import {
    MatriculaDTO,
    AlumnoData,
    PagoMatriculaData,
    ModuloMatriculaDTO,
    DireccionDto,
    TrasladoMatriculaDTO,
} from "../interfaces/dtos";
import { MatriculaRepository } from "../interfaces/repositories";
import { Direccion } from "../../entity";
import { Rol, Usuario } from "../../Auth/entity";
import { encryptPassword } from "../../helpers/encryptPassword";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { uploadImage } from "../../helpers/uploadImage";
import { generateFichaMatricula } from "../helpers/generateFichaMatricula";
import { AppDataSource } from "../../db/dataSource";
import { PensionService } from "../../Pension/services/pension.service";
import { MatriculaModulosModulo } from "../entity/MatriculaModulosModulo";
import {
    CONDICION_ALUMNO,
    ESTADO_MODULO_MATRICULA,
    MODALIDAD,
    TIPO_MATRICULA,
} from "../../interfaces/enums";

const pensionService = new PensionService();
export class MatriculaService implements MatriculaRepository {
    public register = async (data: MatriculaDTO): Promise<Matricula> => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const {
                alumno,
                carreraUuid,
                modulos,
                pagoMatricula,
                secretariaUuid,
                sedeUuid,
                fechaInscripcion,
                fechaInicio,
                tipoMatricula,
            } = data;

            //Registro de datos personales del estudiante
            const newDireccion = await this.registerAddressStudent(
                alumno.direccion
            );
            await queryRunner.manager.save(newDireccion);

            const newUser = await this.registerUserStudent(alumno.dni);
            await queryRunner.manager.save(newUser);

            const newAlumno = await this.registerStudent(
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

            if (modulos) {
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
                    newModulosToMatricula.map((modulo, i) => {
                        return {
                            modulo,
                            modalidad: modulos[i].modalidad,
                            fechaInicio: modulos[i].fechaInicio,
                        };
                    });

                newMatricula.matriculaModulosModulo = await Promise.all(
                    newModulosToMatriculaWithCustomProperties.map(
                        async (modulo) => {
                            const matriculaModulo =
                                new MatriculaModulosModulo();
                            matriculaModulo.matricula = newMatricula;
                            matriculaModulo.modulo = modulo.modulo;
                            matriculaModulo.modalidad = modulo.modalidad;
                            matriculaModulo.fecha_inicio = modulo.fechaInicio;
                            matriculaModulo.estado =
                                ESTADO_MODULO_MATRICULA.MATRICULADO;

                            await queryRunner.manager.save(matriculaModulo);
                            return matriculaModulo;
                        }
                    )
                );
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

                modulosRestantesWithoutNulls.map(async (m) => {
                    const matriculaModulo = new MatriculaModulosModulo();
                    matriculaModulo.modulo = m;
                    matriculaModulo.estado = ESTADO_MODULO_MATRICULA.POR_LLEVAR;
                    await queryRunner.manager.save(matriculaModulo);
                });
            }

            await queryRunner.manager.save(newMatricula);

            //! Registrar pensiones por cada modulo matriculado
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
        //todo: ver como registrar el modulo que va a llevar el causa
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
            const newDireccion = await this.registerAddressStudent(
                alumno.direccion
            );
            await queryRunner.manager.save(newDireccion);

            const newUser = await this.registerUserStudent(alumno.dni);
            await queryRunner.manager.save(newUser);

            const newAlumno = await this.registerStudent(
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
            const duracionCarrera = matricula.carrera.duracion_meses;
            const fechaFin = moment().add(duracionCarrera, "M").toDate();
            const meses: { mes: number; fechaLimite: Date }[] = [];

            const tarifa = await TarifaPensionCarrera.createQueryBuilder("t")
                .innerJoinAndSelect("t.carrera", "c")
                .where("c.uuid=:uuid", { uuid: carreraUuid })
                .getOne();
            if (!tarifa) throw new DatabaseError("Tarifa not found", 500, "");
            const tarifaPension = tarifa.tarifa;

            const yearDifference =
                fechaFin.getFullYear() - fechaInicio.getFullYear();
            for (let i = 0; i < duracionCarrera; i++) {
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
                    monto: tarifaPension,
                    fechaLimite: fechaLimite,
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
                .innerJoinAndSelect("a.grado_estudios", "ge")
                .innerJoinAndSelect("m.secretaria", "sc")
                .innerJoinAndSelect("a.direccion", "d")
                .leftJoinAndSelect("m.grupo", "g")
                .innerJoinAndSelect("m.sede", "s")
                .leftJoinAndSelect("g.horario", "h")
                .leftJoinAndSelect("m.pagoMatricula", "p")
                .leftJoinAndSelect("p.forma_pago", "fp")
                .where(
                    `EXTRACT(YEAR from m.fecha_inscripcion)=:year ${
                        month
                            ? "and EXTRACT(MONTH from m.fecha_inscripcion)=:month "
                            : ""
                    }`,
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
    ): Promise<Matricula> => {
        try {
            const matricula = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.pagoMatricula", "p")
                .where("m.uuid=:uuid", { uuid })
                .getOne();
            if (!matricula)
                throw new DatabaseError(
                    "Matricula not found",
                    500,
                    "Database error"
                );

            const pagoMatricula = await PagoMatricula.findOneBy({
                uuid: matricula.pagoMatricula.uuid,
            });
            if (!pagoMatricula)
                throw new DatabaseError(
                    "Pago Matricula not found",
                    500,
                    "Database error"
                );

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
            const matricula = await Matricula.findOneBy({
                uuid: matriculaUuid,
            });
            if (!matricula)
                throw new DatabaseError(
                    "Matricula not found",
                    500,
                    "Internal server error"
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

            return newPagoMatricula;
        } catch (error) {
            throw error;
        }
    };

    public registerAddressStudent = async (
        direccion: DireccionDto
    ): Promise<Direccion> => {
        try {
            const newDireccionAlumno = new Direccion();
            newDireccionAlumno.uuid = uuid();
            newDireccionAlumno.direccion_exacta = direccion.direccionExacta;
            newDireccionAlumno.distrito = direccion.distrito;
            newDireccionAlumno.provincia = direccion.provincia;
            newDireccionAlumno.departamento = direccion.departamento;

            return newDireccionAlumno;
        } catch (error) {
            throw error;
        }
    };

    public registerUserStudent = async (dni: string): Promise<Usuario> => {
        try {
            const rol = await Rol.findOneBy({ nombre: "Alumno" });

            const newUserAlumno = new Usuario();
            newUserAlumno.uuid = uuid();
            newUserAlumno.usuario = dni;
            newUserAlumno.password = encryptPassword(dni);
            newUserAlumno.rol = rol!;

            return newUserAlumno;
        } catch (error) {
            throw error;
        }
    };

    public registerStudent = async (
        alumno: AlumnoData,
        newDireccionAlumno: Direccion,
        newUserAlumno: Usuario
    ) => {
        try {
            const gradoEstudios = await GradoEstudios.findOneBy({
                uuid: alumno.gradoEstudiosUuid,
            });

            const newAlumno = new Alumno();
            newAlumno.uuid = uuid();
            newAlumno.dni = alumno.dni;
            newAlumno.nombres = alumno.nombres;
            newAlumno.ape_materno = alumno.apeMaterno;
            newAlumno.ape_paterno = alumno.apePaterno;
            newAlumno.edad = alumno.edad;
            newAlumno.sexo = alumno.sexo;
            newAlumno.lugar_residencia = alumno.lugarResidencia;
            newAlumno.celular = alumno.celular;
            newAlumno.celular_referencia = alumno.celularReferencia
            newAlumno.correo = alumno.correo;
            newAlumno.direccion = newDireccionAlumno;
            newAlumno.grado_estudios = gradoEstudios!;
            newAlumno.usuario = newUserAlumno;

            return newAlumno;
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

    public generatePDF = async (
        uuid: string,
        doc: PDF,
        stream: Response<any, Record<string, any>>
    ): Promise<any> => {
        try {
            const data = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.carrera", "c")
                .innerJoinAndSelect("m.modulo", "mo")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("a.direccion", "d")
                .innerJoinAndSelect("a.grado_estudios", "ge")
                .innerJoinAndSelect("m.grupo", "g")
                .innerJoinAndSelect("g.horario", "h")
                .innerJoinAndSelect("m.sede", "s")
                .leftJoinAndSelect("m.pagoMatricula", "p")
                .innerJoinAndSelect("p.forma_pago", "f")
                .where(`m.uuid= :uuid`, { uuid })
                .getOne();
            if (!data) throw new DatabaseError("Matricula not found", 500, "");

            doc.on("data", (data) => stream.write(data));
            doc.on("end", () => stream.end());

            await generateFichaMatricula(data, doc);
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

    public findByStudent = async (_uuid: number): Promise<Matricula> => {
        throw new Error("Method not implemented.");
    };

    public findByUuid = async (_uuid: number): Promise<Matricula> => {
        throw new Error("Method not implemented.");
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
        moduloUuid: string,
        modalidad: MODALIDAD
    ): Promise<Matricula> => {
        try {
            const matricula = await Matricula.findOne({
                where: { uuid: matriculaUuid },
                //relations: { matriculaModulosMatricula: true },
            });

            if (!matricula)
                throw new DatabaseError("Matricula not found", 500, "");

            const modulo = matricula.matriculaModulosModulo.find(
                (m) => m.moduloUuid === moduloUuid
            );
            if (!modulo)
                throw new DatabaseError(
                    "Modulo not found in this matricula",
                    500,
                    ""
                );

            modulo.modalidad = modalidad;

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
