import { TIPO_CARRERA } from "../../interfaces/enums";
import { RegisterModuleDto } from "./registerModuleDto";

export class UpdateCareerDto {
    nombre: string;
    duracionMeses: number;
    tipoCarrera: TIPO_CARRERA;
    modulos: RegisterModuleDto[];
}
