import { v4 as uuid } from "uuid";
import { DatabaseError } from "../errors/DatabaseError";
import { Carrera } from "./carrera.entity";
import { CarreraDTO } from "./interfaces/dtos";
import { Modulo } from "./modulo.entity";

export class CarreraService {
    public async register({
        descripcion,
        duracionMeses,
        fechaInicio,
        finInscripcion,
        images,
        nombre,
        perfilEgreso,
        urlVideo,
        modulos,
    }: CarreraDTO) {
        try {
            let modulesExists;
            if (modulos) {
                const data = await Promise.all(
                    modulos.map((m) => Modulo.findOneBy({ uuid: m }))
                );
                modulesExists = data.filter(Boolean);
            }

            const carrera = new Carrera();
            carrera.uuid = uuid();
            carrera.descripcion = descripcion;
            carrera.duracion_meses = duracionMeses;
            carrera.fecha_inicio = fechaInicio;
            carrera.fin_inscripcion = finInscripcion;
            carrera.nombre = nombre;
            carrera.images = images;
            carrera.perfil_egreso = perfilEgreso;
            carrera.url_video = urlVideo;
            carrera.modulos = (modulesExists as Modulo[]) || null;

            return await carrera.save();
        } catch (error) {
            console.log(error);
            throw new DatabaseError(
                "No se puedo registrar la carrera",
                500,
                ""
            );
        }
    }

    public async findByUuid(uuid: string) {
        try {
            const data = await Carrera.createQueryBuilder("c")
                .innerJoinAndSelect("c.modulos", "m")
                .where("c.uuid = :id", { id: uuid })
                .getOne();

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
