import { v4 as uuid } from "uuid";
import { DatabaseError } from "../../errors/DatabaseError";
import { Carrera, Modulo } from "../entity";
import { CareerDTO } from "../interfaces/dtos";
import { CareerRepository } from "../interfaces/repositories";

export class CareerService implements CareerRepository {
    public async listAll(): Promise<Carrera[]> {
        try {
            const carreras = await Carrera.find();
            return carreras;
        } catch (error) {
            throw error;
        }
    }
    public async register(data: CareerDTO): Promise<Carrera> {
        try {
            const { numModulos, nombre, modulos, modalidad } = data;

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

            const newCareer = new Carrera();
            newCareer.uuid = uuid();
            newCareer.num_modulos = numModulos;
            newCareer.nombre = nombre;
            newCareer.modalidad = modalidad;
            newCareer.modulos = modulosExists;

            return await newCareer.save();
        } catch (error) {
            throw error;
        }
    }
    public async listModules(uuid: string): Promise<Modulo[]> {
        try {
            const data = await Carrera.createQueryBuilder("c")
                .select("modulos")
                .innerJoinAndSelect("c.modulos", "m")
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
}
