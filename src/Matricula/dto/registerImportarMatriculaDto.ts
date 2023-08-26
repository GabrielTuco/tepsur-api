import { RegisterAlumnoDto } from "../../Student/interfaces/dtos";
import { PagoMatriculaData } from "../interfaces/dtos";

export class RegisterImportarMatriculaDto {
    alumno: RegisterAlumnoDto;
    carreraUuid: string;
    // grupoUuid: string;
    moduloActualUuid: string;
    modulosCompletados: string[];
    secretariaUuid: string;
    sedeUuid: string;
    pagoMatricula: PagoMatriculaData;
    fechaInicio: Date;
}
