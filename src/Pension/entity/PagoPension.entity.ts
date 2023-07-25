import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { MetodoPago } from "../../Matricula/entity";
import { Pension } from "./Pension.entity";
import { EntityBase } from "../../entity";
import { EstadoPagoPension } from "../../interfaces/enums";

@Entity()
export class PagoPension extends EntityBase {
    @OneToOne(() => Pension, (pension) => pension.pago_pension)
    @JoinColumn()
    pension: Pension;

    @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.pagos_pension)
    forma_pago: MetodoPago;

    @Column()
    fecha: Date;

    @Column()
    monto: number;

    @Column()
    num_comprobante: string;

    @Column()
    entidad_bancaria: string;

    @Column({ type: "varchar", default: EstadoPagoPension.COMPLETO })
    estado: EstadoPagoPension;
}
