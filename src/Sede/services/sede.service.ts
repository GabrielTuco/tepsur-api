import { Direccion } from "../../entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { Sede } from "../entity/Sede.entity";
import { SedeDTO, SedeRepository } from "../interfaces/sede.repository";

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
    public async findById(id: number): Promise<Sede | null> {
        try {
            const sede = await Sede.createQueryBuilder("s")
                .innerJoinAndSelect("s.direccion", "d")
                .where("s.id= :id", { id })
                .getOne();
            return sede;
        } catch (error) {
            throw new DatabaseError(
                "No se pudo encontrar el registro",
                500,
                ""
            );
        }
    }
    public async register({ nombre, direccion }: SedeDTO): Promise<Sede> {
        try {
            const newAddress = new Direccion();
            newAddress.direccion_exacta = direccion.direccionExacta;
            newAddress.distrito = direccion.distrito;
            newAddress.provincia = direccion.provincia;
            newAddress.departamento = direccion.departamento;
            const savedAddress = await newAddress.save();

            const newSede = new Sede();
            newSede.nombre = nombre;
            newSede.direccion = savedAddress;

            return await newSede.save();
        } catch (error) {
            throw new DatabaseError(
                "No se pudo guardar el nuevo registro",
                500,
                ""
            );
        }
    }
}
