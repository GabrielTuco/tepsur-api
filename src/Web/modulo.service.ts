import { v4 as uuid } from "uuid";
import { Modulo } from "./modulo.entity";
import { DatabaseError } from "../errors/DatabaseError";
import { ModuloDTO } from "./interfaces/dtos";
import { ModuloRepository } from "./interfaces/repositories";

export class ModuloService implements ModuloRepository {
    public async register({
        nombre,
        descripcion,
        urlVideo,
        images,
    }: ModuloDTO) {
        try {
            const modulo = new Modulo();

            modulo.uuid = uuid();
            modulo.nombre = nombre;
            modulo.descripcion = descripcion;
            modulo.url_video = urlVideo;
            modulo.images = images;

            return await modulo.save();
        } catch (error) {
            console.log(error);
            throw new DatabaseError(
                "No se pudo crear el registro",
                404,
                "Database Error"
            );
        }
    }

    public async findAll() {
        try {
            const data = await Modulo.find();
            if (!data) {
                throw new DatabaseError(
                    "No se pudo encontrar los registros",
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

    public async findByUuid(uuid: string) {
        try {
            const data = await Modulo.findOneBy({ uuid });
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
