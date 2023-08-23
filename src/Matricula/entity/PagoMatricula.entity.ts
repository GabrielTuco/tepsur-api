import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { MetodoPago } from "./MetodoPago.entity";
import { TIPO_ENTIDAD_FINANCIERA } from "../../interfaces/enums";

@Entity()
export class PagoMatricula extends EntityBase {
    @Column()
    num_comprobante: string;

    @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.pagos_matricula)
    forma_pago: MetodoPago;

    @Column()
    monto: number;

    @Column({ nullable: true })
    fecha: Date;

    @Column({ nullable: true })
    hora: string;

    @Column({ type: "varchar", nullable: true })
    entidad: TIPO_ENTIDAD_FINANCIERA;

    @Column({ nullable: true })
    foto_comprobante: string;
}
