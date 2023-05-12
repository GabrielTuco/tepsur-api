import { Column, Entity } from "typeorm";
import { EntityBase } from "../../entity";

@Entity()
export class PagoMatricula extends EntityBase {
    @Column()
    uuid: string;

    @Column()
    num_comprobante: string;

    @Column()
    pendiente: boolean;

    @Column()
    forma_pago: string;

    @Column()
    monto: number;
}
