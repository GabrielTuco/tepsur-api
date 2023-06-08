import { Matricula } from "../../Matricula/entity";

export type RegisterPensionDTO = {
    matricula: Matricula;
    mes: number;
    fechaLimite: Date;
    monto: number;
};
