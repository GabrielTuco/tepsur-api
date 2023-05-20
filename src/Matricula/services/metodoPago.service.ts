import {v4 as uuid} from 'uuid';
import { MetodoPago } from "../entity";

export class MetodoPagoService {
    public async register(description: string){
        try {
            const newMetodoPago = new MetodoPago();
            newMetodoPago.uuid=uuid();
            newMetodoPago.description=description;

            return await newMetodoPago.save();
        } catch (error) {
            throw error
        }
    }
}