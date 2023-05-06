import { DatabaseError } from "../../errors/DatabaseError";
import { Carrera, Modulo } from "../entity";
import { CareerDTO } from "../interfaces/dtos";
import { CareerRepository } from "../interfaces/repositories";

export class CareerService implements CareerRepository {
    public async register(data: CareerDTO): Promise<Carrera> {
        try {
            const { numModulos, nombre, modulosUuids } = data;
            const modulos = await Promise.all(
                modulosUuids.map((m) => Modulo.findOneBy({ uuid: m }))
            );
            const modulosExists = modulos.filter((m) => m !== null) as Modulo[];

            const newCareer = new Carrera();

            newCareer.num_modulos = numModulos;
            newCareer.nombre = nombre;
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
