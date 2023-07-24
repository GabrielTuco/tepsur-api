import { v4 as uuid } from "uuid";
import { Secretaria } from "../../Secretary/entity";
import { Sede } from "../../Sede/entity";
import { StudentService } from "../../Student/services/student.service";
import { AppDataSource } from "../../db/dataSource";
import { MatriculaEspecializacion } from "../entity/MatriculaEspecializacion.entity";
import { MatEspeDTO } from "../interfaces/dtos";
import { MatriculaEspecializacionRepository } from "../interfaces/repository";
import { Especializacion } from "../entity/Especializacion.entity";
import { Horario, MetodoPago, PagoMatricula } from "../../Matricula/entity";
import { DatabaseError } from "../../errors/DatabaseError";

const studentService = new StudentService();

export class MatriculaEspecilizacionService
    implements MatriculaEspecializacionRepository
{
    public register = async (
        data: MatEspeDTO
    ): Promise<MatriculaEspecializacion> => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const {
                alumno,
                especializacionUuid,
                fechaInicio,
                fechaInscripcion,
                horario,
                modalidad,
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

            const secretaria = await Secretaria.findOneBy({
                uuid: secretariaUuid,
            });

            const especializacion = await Especializacion.findOneBy({
                uuid: especializacionUuid,
            });

            const sede = await Sede.findOne({
                where: { uuid: sedeUuid },
                relations: { carreras: true },
            });

            const newHorario = new Horario();
            newHorario.uuid = uuid();
            newHorario.hora_inicio = horario.horaInicio;
            newHorario.hora_fin = horario.horaFin;
            newHorario.dias = horario.dias;

            await queryRunner.manager.save(newHorario);

            const newMatricula = new MatriculaEspecializacion();
            newMatricula.uuid = uuid();
            newMatricula.especializacion = especializacion!;
            newMatricula.alumno = newAlumno;
            newMatricula.secretaria = secretaria!;
            newMatricula.sede = sede!;
            newMatricula.fecha_inscripcion = fechaInscripcion;
            newMatricula.fecha_inicio = fechaInicio;
            newMatricula.horario = newHorario;
            newMatricula.modalidad = modalidad;

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
    public listAll = async (
        year: string | undefined,
        month: string | undefined
    ): Promise<MatriculaEspecializacion[]> => {
        try {
            const matriculas =
                await MatriculaEspecializacion.createQueryBuilder("m")
                    .innerJoinAndSelect("m.alumno", "a")
                    .innerJoinAndSelect("a.direccion", "dir")
                    .innerJoinAndSelect("a.grado_estudios", "ge")
                    .innerJoinAndSelect("m.secretaria", "s")
                    .innerJoinAndSelect("m.especializacion", "e")
                    .innerJoinAndSelect("m.horario", "h")
                    .leftJoinAndSelect("m.docente", "d")
                    .leftJoinAndSelect("m.pagoMatricula", "pm")
                    .leftJoinAndSelect("pm.forma_pago", "fp")
                    .innerJoinAndSelect("m.sede", "se")
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
    public findByUuid = async (
        uuid: string
    ): Promise<MatriculaEspecializacion> => {
        try {
            const matricula = await MatriculaEspecializacion.createQueryBuilder(
                "m"
            )
                .innerJoinAndSelect("m.alumno", "a")
                .innerJoinAndSelect("a.direccion", "dir")
                .innerJoinAndSelect("a.grado_estudios", "ge")
                .innerJoinAndSelect("m.secretaria", "s")
                .innerJoinAndSelect("m.especializacion", "e")
                .innerJoinAndSelect("m.horario", "h")
                .leftJoinAndSelect("m.docente", "d")
                .leftJoinAndSelect("m.pagoMatricula", "pm")
                .leftJoinAndSelect("pm.forma_pago", "fp")
                .innerJoinAndSelect("m.sede", "se")
                .where("m.uuid=:uuid", { uuid })
                .getOne();

            if (!matricula)
                throw new DatabaseError(
                    "La matricula no existe",
                    404,
                    "Not found error"
                );
            return matricula;
        } catch (error) {
            throw error;
        }
    };
    public update = async (
        uuid: string,
        data: Partial<MatEspeDTO>
    ): Promise<MatriculaEspecializacion> => {
        try {
            const matricula = await MatriculaEspecializacion.findOneBy({
                uuid,
            });
            if (!matricula)
                throw new DatabaseError(
                    "La matricula no existe",
                    404,
                    "Not found error"
                );

            await MatriculaEspecializacion.update({ uuid }, data);
            await matricula.reload();

            return matricula;
        } catch (error) {
            throw error;
        }
    };
    public delete = async (
        _uuid: string
    ): Promise<MatriculaEspecializacion> => {
        throw new Error("Method not implemented.");
    };
}
