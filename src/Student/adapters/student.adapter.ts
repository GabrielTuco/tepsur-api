import { RegisterAlumnoDto } from "../interfaces/dtos";

export const studentAdapter = (data: Partial<RegisterAlumnoDto>) => {
    return {
        dni: data.dni,
        nombres: data.nombres,
        ape_paterno: data.apePaterno,
        ape_materno: data.apeMaterno,
        correo: data.correo,
        celular: data.celular,
        direccion: data.direccion,
        lugar_residencia: data.lugarResidencia,
    };
};
