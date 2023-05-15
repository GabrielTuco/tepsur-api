import { Secretaria } from "../entity/Secretaria.entity";
import { UpdateSecretaryDTO } from "../interfaces/secretary.dto";

export const adaptedSecretary = (
    data: UpdateSecretaryDTO
): Partial<Secretaria> => {
    return {
        ape_materno: data.apeMaterno,
        ape_paterno: data.apePaterno,
        celular: data.celular,
        correo: data.correo,
        nombres: data.nombres,
    };
};
