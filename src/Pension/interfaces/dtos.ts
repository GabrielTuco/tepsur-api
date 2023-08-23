import { Grupo, Matricula } from "../../Matricula/entity";

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
    // estado: EstadoPagoPension;
}
