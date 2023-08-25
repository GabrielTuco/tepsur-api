import { v4 as uuid } from "uuid";
import { Carrera, Horario, Modulo } from "../../Matricula/entity";
import { CareerRepository } from "../../Matricula/interfaces/repositories";
import { AppDataSource } from "../../db/dataSource";
import { Sede } from "../../Sede/entity/Sede.entity";
import { NotFoundError } from "../../errors/NotFoundError";
import { AlreadyExistsError } from "../../errors/AlreadyExistsError";
import { RegisterCareerDto, UpdateCareerDto } from "../dto";

export class CareerService implements CareerRepository {
    public listBySede = async (sedeUuid: string): Promise<any[]> => {
        try {
            const sede = await Sede.find({ where: { uuid: sedeUuid } });

            const sedeExists = await Sede.createQueryBuilder("s")
                .leftJoinAndSelect("s.carreras", "c")
                .leftJoinAndSelect("c.modulos", "m")
                .where("s.uuid=:uuid", { uuid: sedeUuid })
                .getOne();

            if (!sedeExists) throw new NotFoundError("La sede no existe");

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
            const carreras = await Carrera.createQueryBuilder("c")
                .leftJoinAndSelect("c.modulos", "m")
                .getMany();

            return carreras;
        } catch (error) {
            throw error;
        }
    };

    public register = async (data: RegisterCareerDto): Promise<Carrera> => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const { nombre, modulos, duracionMeses, tipoCarrera, sedeUuid } = data;
        try {
            const modulosExists: Modulo[] = await Promise.all(
                modulos.map(async (moduloData) => {
                    const newModulo = new Modulo();
                    newModulo.uuid = uuid();
                    newModulo.nombre = moduloData.nombre;
                    newModulo.duracion_semanas = moduloData.duracionSemanas;
                    newModulo.orden = moduloData.orden;

                    await queryRunner.manager.save(newModulo);
                    return newModulo;
                })
            );
            const sede = await Sede.findOne({
                where: { uuid: sedeUuid },
                relations: { carreras: true },
            });

            if (!sede) throw new NotFoundError("La sede no existe");

            const newCareer = new Carrera();
            newCareer.uuid = uuid();
            newCareer.num_modulos = modulosExists.length;
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
            const carrera = await Carrera.createQueryBuilder("c")
                .innerJoinAndSelect("c.modulos", "m")
                .where("c.uuid = :uuid and c.estado='activo'", { uuid })
                .getOne();

            if (!carrera)
                throw new NotFoundError("No se encontro los registros");

            const modules = carrera.modulos;

            return modules;
        } catch (error) {
            throw error;
        }
    };

    public listHorarios = async (uuid: string): Promise<Horario[]> => {
        try {
            const carrera = await Carrera.createQueryBuilder("c")
                .leftJoinAndSelect("c.grupos", "g")
                .leftJoinAndSelect("g.horario", "h")
                .where(`c.uuid=:uuid`, {
                    uuid,
                })
                .getOne();
            if (!carrera)
                throw new NotFoundError(
                    "La carrera no existe o no tiene grupos registrados"
                );

            console.log(carrera);
            const horarios = carrera?.grupos.map((g) => g.horario);

            return horarios!;
        } catch (error) {
            throw error;
        }
    };

    public findByUuid = async (uuid: string): Promise<Carrera> => {
        try {
            const data = await Carrera.findOneBy({ uuid, estado: "activo" });
            if (!data) {
                throw new NotFoundError("No se encontro el registro");
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
                throw new NotFoundError("No se encontro el registro");
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    public update = async (
        careerUuid: string,
        data: UpdateCareerDto
    ): Promise<Carrera> => {
        try {
            const career = await Carrera.findOne({
                where: { uuid: careerUuid },
                relations: { modulos: true },
            });

            if (!career) throw new NotFoundError("La carrera no existe");

            career.nombre = data.nombre;
            career.duracion_meses = data.duracionMeses;
            career.tipo_carrera = data.tipoCarrera;

            if (data.modulos) {
                career.modulos = await Promise.all(
                    data.modulos.map(async (modulo) => {
                        if (modulo.uuid) {
                            const moduloExists = await Modulo.findOneBy({
                                uuid: modulo.uuid,
                            });
                            if (!moduloExists)
                                throw new NotFoundError("El modulo no existe");

                            moduloExists.duracion_semanas =
                                modulo.duracionSemanas;
                            moduloExists.nombre = modulo.nombre;
                            moduloExists.orden = modulo.orden;

                            await moduloExists.save();
                            await moduloExists.reload();

                            return moduloExists;
                        } else {
                            const newModulo = new Modulo();
                            newModulo.uuid = uuid();
                            newModulo.nombre = modulo.nombre;
                            newModulo.duracion_semanas = modulo.duracionSemanas;
                            newModulo.orden = modulo.orden;

                            await newModulo.save();
                            return newModulo;
                        }
                    })
                );
            }

            await career.save();
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

            if (!career) throw new NotFoundError("La carrera no existe");

            const module = career.modulos.find(
                (m) => m.nombre === moduleData.nombre
            );
            if (module)
                throw new AlreadyExistsError(
                    "El modulo ya esta registrado en la carrera"
                );

            const newModuleToCareer = new Modulo();
            newModuleToCareer.uuid = uuid();
            newModuleToCareer.nombre = moduleData.nombre!;
            newModuleToCareer.duracion_semanas = moduleData.duracion_semanas!;
            newModuleToCareer.orden = moduleData.orden!;

            await newModuleToCareer.save();
            career.modulos.push(newModuleToCareer);

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
            if (!career) throw new NotFoundError("La carrera no exise");

            const module = career.modulos.find((m) => m.uuid === moduleUuid);
            if (!module)
                throw new NotFoundError(
                    "El modulo no esta registrado en la carrera"
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
            if (!carrera) throw new NotFoundError("La carrera no exste");
            carrera.estado = "inactivo";
            await carrera.save();
            await carrera.reload();

            return carrera;
        } catch (error) {
            throw error;
        }
    };
}
