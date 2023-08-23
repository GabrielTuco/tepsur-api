import { MODALIDAD } from "../../interfaces/enums";

export class CreateTarifaPensionDto {
    sedeUuid: string;
    carreraUuid: string;
    tarifa: number;
    modalidad: MODALIDAD;
}
