import { Direccion } from "../../entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Sede } from "../entity/Sede.entity";
import { SedeDTO, SedeRepository } from "../interfaces/sede.repository";
import { v4 as uuid } from "uuid";

export class SedeService implements SedeRepository {
    public async listAll(): Promise<Sede[]> {
        try {
            const data = await Sede.createQueryBuilder("s")
                .innerJoinAndSelect("s.direccion", "d")
                .getMany();
            return data;
        } catch (error) {
            console.log(error);
            throw new DatabaseError(
                "No se pudieron obtener los registros",
                500,
                ""
            );
        }
    }
    public async findById(uuid: string): Promise<Sede | null> {
        try {
            const sede = await Sede.createQueryBuilder("s")
                .innerJoinAndSelect("s.direccion", "d")
                .where("s.uuid= :uuid", { uuid })
                .getOne();
            return sede;
        } catch (error) {
            throw new DatabaseError(
                "No se pudo encontrar el registro",
                404,
                ""
            );
        }
    }
    public async register({ nombre, direccion }: SedeDTO): Promise<Sede> {
        try {
            const newAddress = new Direccion();
            newAddress.uuid = uuid();
            newAddress.direccion_exacta = direccion.direccionExacta;
            newAddress.distrito = direccion.distrito;
            newAddress.provincia = direccion.provincia;
            newAddress.departamento = direccion.departamento;
            const savedAddress = await newAddress.save();

            const newSede = new Sede();
            newSede.uuid = uuid();
            newSede.nombre = nombre;
            newSede.direccion = savedAddress;

            return await newSede.save();
        } catch (error) {
            console.log(error);
            throw new DatabaseError(
                "No se pudo guardar el nuevo registro",
                500,
                ""
            );
        }
    }
}
