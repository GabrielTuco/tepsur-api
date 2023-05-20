import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { PagoMatricula } from "./PagoMatricula.entity";

@Entity()
export class MetodoPago extends BaseEntity {
    @PrimaryColumn()
    uuid: string;

    @Column()
    description: string;

    @OneToMany(() => PagoMatricula, (pagoMatricula) => pagoMatricula.forma_pago)
    pagos_matricula: PagoMatricula[];
}
