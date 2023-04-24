import { DatabaseError } from "../errors/DatabaseError";
import { Carrera } from "./carrera.entity";

export class CarreraService {
    public async findById(id: number) {
        try {
            const data = await Carrera.findOneBy({ id });
            if (!data) {
                throw new DatabaseError(
                    "No se pudo encontrar el registro",
                    404,
                    "Register not found"
                );
            }
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
