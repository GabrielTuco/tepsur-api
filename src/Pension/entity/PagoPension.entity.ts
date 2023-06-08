import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { MetodoPago } from "../../Matricula/entity";
import { Pension } from "./Pension.entity";
import { EntityBase } from "../../entity";

enum EstadoPagoPension {
    PENDIENTE = "PENDIENTE",
    COMPROMISO = "COMPROMISO",
    COMPLETO = "COMPLETO",
}

@Entity()
export class PagoPension extends EntityBase {
    @OneToOne(() => Pension)
    @JoinColumn()
    pension: Pension;

    @OneToOne(() => MetodoPago)
    @JoinColumn()
    forma_pago: MetodoPago;

    @Column()
    fecha: Date;

    @Column()
    monto: number;

    @Column()
    num_comprobante: string;

    @Column()
    entidad_bancaria: string;

    @Column()
    estado: EstadoPagoPension;
}
