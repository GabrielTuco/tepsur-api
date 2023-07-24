import { Column, Entity, ManyToOne, OneToOne } from "typeorm";
import { Matricula } from "../../Matricula/entity";
import { EntityBase } from "../../entity";
import { PagoPension } from "./PagoPension.entity";

@Entity()
export class Pension extends EntityBase {
    @ManyToOne(() => Matricula, (matricula) => matricula.pensiones)
    matricula: Matricula;

    @Column()
    mes: number;

    @Column()
    fecha_limite: Date;

    @Column()
    monto: number;

    @OneToOne(() => PagoPension, (pagoPension) => pagoPension.pension)
    pago_pension: PagoPension;
}
