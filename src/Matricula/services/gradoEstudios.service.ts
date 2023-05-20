import { v4 as uuid } from "uuid";
import { GradoEstudios } from "../entity";
import { GradoEstudiosDTO } from "../interfaces/dtos";

export class GradoEstudiosService {
    public async register(data: GradoEstudiosDTO): Promise<GradoEstudios> {
        try {
            const newGradoEstudios = new GradoEstudios();
            newGradoEstudios.uuid = uuid();
            newGradoEstudios.descripcion = data.descripcion;

            return await newGradoEstudios.save();
        } catch (error) {
            throw error;
        }
    }
}
