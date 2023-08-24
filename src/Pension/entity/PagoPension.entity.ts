import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { MetodoPago } from "../../Matricula/entity";
import { Pension } from "./Pension.entity";
import { EntityBase } from "../../entity";
import {
    EstadoPagoPension,
    TIPO_ENTIDAD_FINANCIERA,
} from "../../interfaces/enums";

@Entity()
export class PagoPension extends EntityBase {
    @ManyToOne(() => Pension, (pension) => pension.pago_pensiones)
    pension: Pension;

    @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.pagos_pension)
    forma_pago: MetodoPago;

    @Column()
    fecha: Date;

    @Column()
    hora: string;

    @Column()
    monto: number;

    @Column()
    num_comprobante: string;

    @Column({ type: "varchar", nullable: true })
    entidad: TIPO_ENTIDAD_FINANCIERA;

    @Column({ nullable: true })
    foto_comprobante: string;
}
