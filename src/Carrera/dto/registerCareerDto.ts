import { TIPO_CARRERA } from "../../interfaces/enums";
import { RegisterModuleDto } from "./registerModuleDto";

export class RegisterCareerDto {
    nombre: string;
    modulos: RegisterModuleDto[];
    duracionMeses: number;
    tipoCarrera: TIPO_CARRERA;
    sedeUuid: string;
    tarifas: {
        presencial: number;
        virtual: number;
    };
}
