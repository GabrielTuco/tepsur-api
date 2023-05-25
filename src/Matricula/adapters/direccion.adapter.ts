import { Direccion } from "../../entity";
import { DireccionDto } from "../interfaces/dtos";

export const adaptedDireccion = (
    direccion: DireccionDto
): Partial<Direccion> => {
    return {
        direccion_exacta: direccion.direccionExacta,
        distrito: direccion.distrito,
        provincia: direccion.provincia,
        departamento: direccion.departamento,
    };
};
