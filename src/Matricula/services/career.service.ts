import { v4 as uuid } from "uuid";
import { DatabaseError } from "../../errors/DatabaseError";
import { Carrera, Horario, Modulo } from "../entity";
import { CareerDTO, HorarioDTO } from "../interfaces/dtos";
import { CareerRepository } from "../interfaces/repositories";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { AppDataSource } from "../../db/dataSource";
import { QueryRunner } from "typeorm";
import { TIPO_CARRERA } from "../../interfaces/enums";
import { Sede } from "../../Sede/entity/Sede.entity";

export class CareerService implements CareerRepository {
    public async listAll(): Promise<Carrera[]> {
        try {
            const carreras = await Carrera.find({
                where: {
                    estado: "activo",
                },
                relations: {
                    modulos: true,
                },
            });
            return carreras;
        } catch (error) {
            throw error;
        }
    }

    public async register(data: CareerDTO): Promise<Carrera> {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const {
            numModulos,
            nombre,
            modulos,
            duracionMeses,
            tipoCarrera,
            sedeUuid,
        } = data;
        try {
            const modulosExists: Modulo[] = await Promise.all(
                modulos.map(async (moduloData) => {
                    const modulo = await Modulo.findOneBy({
                        nombre: moduloData.nombre,
                    });
                    if (modulo) return modulo;
                    else {
                        const newModulo = new Modulo();
                        newModulo.uuid = uuid();
                        newModulo.nombre = moduloData.nombre;
                        newModulo.duracion_semanas = moduloData.duracionSemanas;

                        if (tipoCarrera === TIPO_CARRERA.MODULAR) {
                            const horarios = await Promise.all(
                                moduloData.horarios.map(async (horarioData) => {
                                    const horario = await findOrCreateHorario(
                                        horarioData,
                                        queryRunner
                                    );
                                    return horario;
                                })
                            );
                            const docente = await findDocenteByUuid(
                                moduloData.docenteUuid
                            );

                            newModulo.horarios = horarios;
                            newModulo.docente = docente!;
                        }

                        await queryRunner.manager.save(newModulo);
                        return newModulo;
                    }
                })
            );
            const sede = await Sede.findOne({
                where: { uuid: sedeUuid },
                relations: { carreras: true },
            });

            if (!sede) throw new DatabaseError("Sede not found", 500, "");

            const newCareer = new Carrera();
            newCareer.uuid = uuid();
            newCareer.num_modulos = numModulos;
            newCareer.nombre = nombre;
            newCareer.duracion_meses = duracionMeses;
            newCareer.modulos = modulosExists;
            newCareer.tipo_carrera = tipoCarrera;

            await queryRunner.manager.save(newCareer);

            sede.carreras.push(newCareer);

            await queryRunner.manager.save(sede);
            await queryRunner.commitTransaction();

            return newCareer;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    public async listModules(uuid: string): Promise<Modulo[]> {
        try {
            const data = await Carrera.createQueryBuilder("c")
                .leftJoinAndSelect("c.modulos", "modulo")
                .where("c.uuid = :uuid", { uuid })
                .getOne();

            if (!data) {
                throw new DatabaseError("No se econtro los registros", 404, "");
            }

            const modules = data!.modulos;

            return modules;
        } catch (error) {
            throw error;
        }
    }

    //TODO: armar nueva query dependiendo del tipo de carrera retornar los horarios
    public async listHorarios(_uuid: string): Promise<Horario[]> {
        try {
            const horarios = await Horario.find();

            return horarios;
        } catch (error) {
            throw error;
        }
    }

    public async findByUuid(uuid: string): Promise<Carrera> {
        try {
            const data = await Carrera.findOneBy({ uuid });
            if (!data) {
                throw new DatabaseError("No se econtro el registro", 404, "");
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
    public async findByName(name: string): Promise<Carrera> {
        try {
            const data = await Carrera.findOneBy({ nombre: name });
            if (!data) {
                throw new DatabaseError("No se econtro el registro", 404, "");
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
    public async update(
        uuid: string,
        data: Partial<Carrera>
    ): Promise<Carrera> {
        try {
            const career = await Carrera.findOneBy({ uuid });
            if (!career) throw new DatabaseError("Career not found", 404, "");

            await Carrera.update({ uuid }, data);
            await career.reload();
            return career;
        } catch (error) {
            throw error;
        }
    }
    public async addModule(
        careerUuid: string,
        moduleData: Partial<Modulo>
    ): Promise<Carrera> {
        try {
            const career = await Carrera.findOne({
                relations: { modulos: true },
                where: { uuid: careerUuid },
            });
            if (!career) throw new DatabaseError("Career not found", 500, "");

            const module = career.modulos.find(
                (m) => m.nombre === moduleData.nombre
            );
            if (module)
                throw new DatabaseError(
                    "El modulo ya esta registrado en la carrera",
                    500,
                    ""
                );

            const moduloExists = await Modulo.findOneBy({
                nombre: moduleData.nombre,
            });

            if (moduloExists) {
                career.modulos.push(moduloExists);
            } else {
                const newModuleToCareer = new Modulo();
                newModuleToCareer.uuid = uuid();
                newModuleToCareer.nombre = moduleData.nombre!;
                newModuleToCareer.duracion_semanas =
                    moduleData.duracion_semanas!;
                await newModuleToCareer.save();
                career.modulos.push(newModuleToCareer);
            }
            await career.save();
            await career.reload();

            return career;
        } catch (error) {
            throw error;
        }
    }
    public async removeModule(
        careerUuid: string,
        moduleUuid: string
    ): Promise<Carrera> {
        try {
            const career = await Carrera.findOne({
                relations: { modulos: true },
                where: { uuid: careerUuid },
            });
            if (!career) throw new DatabaseError("Career not found", 500, "");

            const module = career.modulos.find((m) => m.uuid === moduleUuid);
            if (!module)
                throw new DatabaseError(
                    "El modulo no esta registrado en la carrera",
                    500,
                    ""
                );

            career.modulos = career.modulos.filter(
                (m) => m.uuid !== moduleUuid
            );

            await career.save();
            await career.reload();

            return career;
        } catch (error) {
            throw error;
        }
    }

    public async delete(uuid: string): Promise<Carrera> {
        try {
            const carrera = await Carrera.findOne({ where: { uuid } });
            if (!carrera)
                throw new DatabaseError(
                    "Carrera not found",
                    404,
                    "Not found error"
                );
            carrera.estado = "inactivo";
            await carrera.save();
            await carrera.reload();

            return carrera;
        } catch (error) {
            throw error;
        }
    }
}

async function findOrCreateHorario(
    horarioData: HorarioDTO,
    queryRunner: QueryRunner
): Promise<Horario> {
    try {
        const horario = await Horario.createQueryBuilder("h")
            .where(
                "h.hora_inicio = :inicio AND h.hora_fin = :fin AND array_to_string(h.dias, ',') = :dias",
                {
                    inicio: horarioData.horaInicio,
                    fin: horarioData.horaFin,
                    dias: horarioData.dias.toString(),
                }
            )
            .getOne();

        if (horario) {
            return horario;
        } else {
            const newHorario = new Horario();
            newHorario.uuid = uuid();
            newHorario.hora_inicio = horarioData.horaInicio;
            newHorario.hora_fin = horarioData.horaFin;
            newHorario.dias = horarioData.dias;
            await queryRunner.manager.save(newHorario);
            return newHorario;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function findDocenteByUuid(docenteUuid: string): Promise<Docente | null> {
    return await Docente.findOneBy({ uuid: docenteUuid });
}
