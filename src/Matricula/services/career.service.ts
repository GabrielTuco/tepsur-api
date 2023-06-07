import { v4 as uuid } from "uuid";
import { DatabaseError } from "../../errors/DatabaseError";
import { Carrera, Horario, Modulo } from "../entity";
import { CareerDTO } from "../interfaces/dtos";
import { CareerRepository } from "../interfaces/repositories";

export class CareerService implements CareerRepository {
    public async listAll(): Promise<Carrera[]> {
        try {
            const carreras = await Carrera.find({
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
        try {
            const { numModulos, nombre, modulos,horariosExistentes,horariosNuevos, modalidad } = data;

            const modulosExists: Modulo[] = await Promise.all(
                modulos.map(async (mod) => {
                    const modulo = await Modulo.findOneBy({
                        nombre: mod.nombre,
                    });
                    if (modulo) {
                        return modulo;
                    } else {
                        const newModulo = new Modulo();
                        newModulo.uuid = uuid();
                        newModulo.nombre = mod.nombre;
                        newModulo.duracion_semanas = mod.duracionSemanas;

                        const savedModulo = await newModulo.save();
                        return savedModulo;
                    }
                })
            );
            let horariosExists:(Horario | undefined)[] = []
            horariosExists = await Promise.all(
                horariosExistentes.map(async (h) => {
                    const horario = await Horario.findOneBy({uuid:h})
                    if (horario) return horario;
                })
            );

            let horarios:Horario[] = horariosExists.filter(h=>h!==undefined) as Horario[]
            const nuevosHorarios = await Promise.all(horariosNuevos.map(async(h)=>{
                const newHorario = new Horario()
                newHorario.uuid = uuid()
                newHorario.hora_inicio = h.horaInicio
                newHorario.hora_fin = h.horaFin
                newHorario.dias = h.dias

                await newHorario.save()
                return newHorario
            }))

            horarios = [...horarios, ...nuevosHorarios]


            const newCareer = new Carrera();
            newCareer.uuid = uuid();
            newCareer.num_modulos = numModulos;
            newCareer.nombre = nombre;
            newCareer.modalidad = modalidad;
            newCareer.modulos = modulosExists;
            newCareer.horarios = horarios;

            return await newCareer.save();
        } catch (error) {
            throw error;
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
}
