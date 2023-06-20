import { Response } from "express";
import { QueryRunner } from "typeorm";
import { v4 as uuid } from "uuid";
import PDF from "pdfkit-table";
import fileUpload from "express-fileupload";
import moment from "moment";

import { Alumno } from "../../Student/entity/Alumno.entity";
import {
    Carrera,
    GradoEstudios,
    Grupo,
    Horario,
    Matricula,
    MetodoPago,
    Modulo,
    PagoMatricula,
} from "../entity";
import {
    MatriculaDTO,
    AlumnoData,
    PagoMatriculaData,
} from "../interfaces/dtos";
import { MatriculaRepository } from "../interfaces/repositories";
import { Direccion } from "../../entity";
import { adaptedDireccion } from "../adapters/direccion.adapter";
import { Rol, Usuario } from "../../Auth/entity";
import { encryptPassword } from "../../helpers/encryptPassword";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { uploadImage } from "../../helpers/uploadImage";
import { generateFichaMatricula } from "../helpers/generateFichaMatricula";
import { AppDataSource } from "../../db/dataSource";
import { PensionService } from "../../Pension/services/pension.service";

const pensionService = new PensionService();
export class MatriculaService implements MatriculaRepository {
    public async register(data: MatriculaDTO): Promise<Matricula> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const {
                alumno,
                carreraUuid,
                horarioUuid,
                modulos,
                pagoMatricula,
                secretariaUuid,
                sedeUuid,
                fechaInscripcion,
                fechaInicio,
            } = data;

            //Registro de datos personales del estudiante
            const newAlumno = await this.registerStudent(alumno, queryRunner);

            //Registro de datos academicos del estudiante
            const newMatricula = new Matricula();
            const carrera = await Carrera.findOneBy({ uuid: carreraUuid });
            const secretaria = await Secretaria.findOneBy({
                uuid: secretariaUuid,
            });
            const sede = await Sede.findOneBy({ uuid: sedeUuid });

            //const horario = await Horario.findOneBy({ uuid: horarioUuid });
            //const grupo = await this.setRandomGroup(horarioUuid);

            newMatricula.uuid = uuid();
            newMatricula.carrera = carrera!;
            newMatricula.alumno = newAlumno;
            //newMatricula.grupo = grupo!;
            newMatricula.secretaria = secretaria!;
            newMatricula.sede = sede!;
            newMatricula.fecha_inscripcion = fechaInscripcion;
            newMatricula.fecha_inicio = fechaInicio;

            if (modulos) {
                const modulosExists = await Promise.all(
                    modulos.map(
                        async (m) => await Modulo.findOneBy({ uuid: m })
                    )
                );
                newMatricula.modulos = modulosExists.filter(
                    (element): element is Modulo => element !== null
                );
            }

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

            await queryRunner.manager.save(newMatricula);

            await queryRunner.commitTransaction();

            //await this.registerPensiones(newMatricula);

            return newMatricula;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    public async registerPensiones(matricula: Matricula): Promise<void> {
        try {
            const fechaInicio = new Date(matricula.fecha_inicio);
            const mesInicio = fechaInicio.getMonth() + 1;
            const duracionCarrera = matricula.carrera.duracion_meses;
            const fechaFin = moment().add(duracionCarrera, "M").toDate();
            const meses: number[] = [];

            const yearDifference =
                fechaFin.getFullYear() - fechaInicio.getFullYear();
            for (let i = 0; i < duracionCarrera; i++) {
                if (mesInicio + i > 12)
                    meses.push(mesInicio + i - 12 * yearDifference);
                else meses.push(mesInicio + i);
            }

            meses.map(async (m) => {
                const pension = await pensionService.register({
                    matricula,
                    mes: m,
                    monto: 150,
                    fechaLimite: new Date(),
                });
                return pension;
            });
        } catch (error) {
            throw error;
        }
    }

    public async setRandomGroup(horarioUuid: string): Promise<Grupo> {
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
    }

    public async getAll(
        year: string | undefined,
        month: string | undefined
    ): Promise<Matricula[]> {
        try {
            const matriculas = await Matricula.createQueryBuilder("m")
                .innerJoinAndSelect("m.carrera", "c")
                .innerJoinAndSelect("m.modulo", "mo")
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("a.grado_estudios", "ge")
                .innerJoinAndSelect("m.secretaria", "sc")
                .innerJoinAndSelect("a.direccion", "d")
                .leftJoinAndSelect("m.grupo", "g")
                .innerJoinAndSelect("m.sede", "s")
                .innerJoinAndSelect("g.horario", "h")
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
    }

    //Subida del documento de pago de matricula
    public async uploadPaidDocument(
        uuid: string,
        image: fileUpload.UploadedFile
    ): Promise<Matricula> {
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
    }

    //Registro de pago de matricula
    public async updatePagoMatricula(
        matriculaUuid: string,
        data: PagoMatriculaData
    ): Promise<PagoMatricula> {
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
    }

    public async findByStudent(_uuid: number): Promise<Matricula> {
        throw new Error("Method not implemented.");
    }
    public async findByUuid(_uuid: number): Promise<Matricula> {
        throw new Error("Method not implemented.");
    }
    async registerStudent(alumno: AlumnoData, queryRunner: QueryRunner) {
        try {
            const newDireccionAlumno = new Direccion();
            newDireccionAlumno.uuid = uuid();
            Object.assign(
                newDireccionAlumno,
                adaptedDireccion(alumno.direccion)
            );
            //await newDireccionAlumno.save();
            await queryRunner.manager.save(newDireccionAlumno);

            const gradoEstudios = await GradoEstudios.findOneBy({
                uuid: alumno.gradoEstudiosUuid,
            });

            const rol = await Rol.findOneBy({ nombre: "Alumno" });
            const newUserAlumno = new Usuario();

            newUserAlumno.uuid = uuid();
            newUserAlumno.usuario = alumno.dni;
            newUserAlumno.password = encryptPassword(alumno.dni);
            newUserAlumno.rol = rol!;

            // await newUserAlumno.save();
            await queryRunner.manager.save(newUserAlumno);

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
            newAlumno.correo = alumno.correo;
            newAlumno.direccion = newDireccionAlumno;
            newAlumno.grado_estudios = gradoEstudios!;
            newAlumno.usuario = newUserAlumno;

            await queryRunner.manager.save(newAlumno);
            return newAlumno;
        } catch (error) {
            throw error;
        }
    }

    public async generatePDF(
        uuid: string,
        doc: PDF,
        stream: Response<any, Record<string, any>>
    ): Promise<any> {
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
    }

    public async update(
        _uuid: string,
        _data: Partial<MatriculaDTO>
    ): Promise<Matricula> {
        throw new Error("Method not implemented.");
    }
    public async delete(_uuid: string): Promise<Matricula> {
        throw new Error("Method not implemented.");
    }

    public async listModules(): Promise<Modulo[]> {
        try {
            const modules = await Modulo.find();

            return modules;
        } catch (error) {
            throw error;
        }
    }
}
