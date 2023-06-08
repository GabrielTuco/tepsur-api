import { MetodoPago } from "../entity";
import { DatabaseError } from "../../errors/DatabaseError";
import { MetodoPagoRepository } from "../interfaces/repositories";

export class MetodoPagoService implements MetodoPagoRepository {
    public async register(description: string) {
        try {
            const newMetodoPago = new MetodoPago();
            newMetodoPago.description = description;
            return await newMetodoPago.save();
        } catch (error) {
            throw error;
        }
    }

    public async getAll() {
        try {
            const metodosPago = await MetodoPago.find();
            return metodosPago;
        } catch (error) {
            throw error;
        }
    }

    public async update(uuid: number, description: string) {
        try {
            const metodoPagoExists = await MetodoPago.findOneBy({ uuid });
            if (!metodoPagoExists)
                throw new DatabaseError(
                    "MetodoPago does not exist",
                    500,
                    "Internal server error"
                );
            metodoPagoExists.description = description;
            await metodoPagoExists.save();
            await metodoPagoExists.reload();

            return metodoPagoExists;
        } catch (error) {
            throw error;
        }
    }
}
