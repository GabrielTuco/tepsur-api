import { v4 as uuid } from "uuid";
import { DatabaseError } from "../../errors/DatabaseError";
import { Carrera, Horario, Modulo } from "../entity";
import { CareerDTO } from "../interfaces/dtos";
import { CareerRepository } from "../interfaces/repositories";
import { AppDataSource } from "../../db/dataSource";
import { Sede } from "../../Sede/entity/Sede.entity";

export class CareerService implements CareerRepository {
    public listBySede = async (sedeUuid: string): Promise<any[]> => {
        try {
            const sede = await Sede.find({ where: { uuid: sedeUuid } });

            const sedeExists = await Sede.createQueryBuilder("s")
                .innerJoinAndSelect("s.carreras", "c")
                .innerJoinAndSelect("c.modulos", "m")
                .where("s.uuid=:uuid", { uuid: sedeUuid })
                .getOne();

            if (!sedeExists)
                throw new DatabaseError(
                    "La sede no existe",
                    404,
                    "Not found error"
                );

            const carreras = sedeExists.carreras.map((carrera) => ({
                ...carrera,
                sede,
            }));

            return carreras;
        } catch (error) {
            throw error;
        }
    };

    public listAll = async (): Promise<Carrera[]> => {
        try {
            console.log("list all");
            const carreras = await Carrera.createQueryBuilder("c").getMany();

            return carreras;
        } catch (error) {
            throw error;
        }
    };
    public register = async (data: CareerDTO): Promise<Carrera> => {
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
                        newModulo.orden = moduloData.orden;

                        await queryRunner.manager.save(newModulo);
                        return newModulo;
                    }
                })
            );
            const sede = await Sede.findOne({
                where: { uuid: sedeUuid },
                relations: { carreras: true },
            });

            if (!sede) throw new DatabaseError("Sede not found", 404, "");

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
    };

    public listModules = async (uuid: string): Promise<Modulo[]> => {
        try {
            const data = await Carrera.createQueryBuilder("c")
                .leftJoinAndSelect("c.modulos", "modulo")
                .where("c.uuid = :uuid and c.estado='activo'", { uuid })
                .getOne();

            if (!data) {
                throw new DatabaseError("No se econtro los registros", 404, "");
            }

            const modules = data!.modulos;

            return modules;
        } catch (error) {
            throw error;
        }
    };

    //TODO: armar nueva query dependiendo del tipo de carrera retornar los horarios
    public listHorarios = async (_uuid: string): Promise<Horario[]> => {
        try {
            const horarios = await Horario.find();

            return horarios;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<Carrera> => {
        try {
            const data = await Carrera.findOneBy({ uuid, estado: "activo" });
            if (!data) {
                throw new DatabaseError("No se econtro el registro", 404, "");
            }
            return data;
        } catch (error) {
            throw error;
        }
    };
    public findByName = async (name: string): Promise<Carrera> => {
        try {
            const data = await Carrera.findOneBy({
                nombre: name,
                estado: "activo",
            });
            if (!data) {
                throw new DatabaseError("No se econtro el registro", 404, "");
            }
            return data;
        } catch (error) {
            throw error;
        }
    };
    public update = async (
        uuid: string,
        data: Partial<Carrera>
    ): Promise<Carrera> => {
        try {
            const career = await Carrera.findOneBy({ uuid });
            if (!career)
                throw new DatabaseError(
                    "La carrera no existe",
                    404,
                    "Not found error"
                );

            await Carrera.update({ uuid }, data);
            await career.reload();
            return career;
        } catch (error) {
            throw error;
        }
    };
    public addModule = async (
        careerUuid: string,
        moduleData: Partial<Modulo>
    ): Promise<Carrera> => {
        try {
            const career = await Carrera.findOne({
                relations: { modulos: true },
                where: { uuid: careerUuid, estado: "activo" },
            });
            if (!career)
                throw new DatabaseError(
                    "La carrera no existe",
                    404,
                    "Not found error"
                );

            const module = career.modulos.find(
                (m) => m.nombre === moduleData.nombre
            );
            if (module)
                throw new DatabaseError(
                    "El modulo ya esta registrado en la carrera",
                    400,
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
                newModuleToCareer.orden = moduleData.orden!;
                await newModuleToCareer.save();
                career.modulos.push(newModuleToCareer);
            }
            await career.save();
            await career.reload();

            return career;
        } catch (error) {
            throw error;
        }
    };
    public removeModule = async (
        careerUuid: string,
        moduleUuid: string
    ): Promise<Carrera> => {
        try {
            const career = await Carrera.findOne({
                relations: { modulos: true },
                where: { uuid: careerUuid, estado: "activo" },
            });
            if (!career)
                throw new DatabaseError(
                    "La carrera no exise",
                    404,
                    "Not found error"
                );

            const module = career.modulos.find((m) => m.uuid === moduleUuid);
            if (!module)
                throw new DatabaseError(
                    "El modulo no esta registrado en la carrera",
                    404,
                    "Not found error"
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
    };

    public delete = async (uuid: string): Promise<Carrera> => {
        try {
            const carrera = await Carrera.findOne({ where: { uuid } });
            if (!carrera)
                throw new DatabaseError(
                    "La carrera no exste",
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
    };
}
