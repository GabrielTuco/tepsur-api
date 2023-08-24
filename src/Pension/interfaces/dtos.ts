import { Grupo, Matricula } from "../../Matricula/entity";
import { TIPO_ENTIDAD_FINANCIERA } from "../../interfaces/enums";

export class RegisterPensionDTO {
    matricula: Matricula;
    grupo: Grupo;
    mes: number;
    fechaLimite: Date;
    monto: number;
}

export class RegisterPagoPensionDto {
    formaPagoUuid: number;
    fecha: Date;
    hora: string;
    numComprobante: string;
    monto: number;
    entidad: TIPO_ENTIDAD_FINANCIERA;
    // estado: EstadoPagoPension;
}
