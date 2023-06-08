import { Column, Entity, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Matricula } from "../../Matricula/entity";
import { PagoPension } from "./PagoPension.entity";
import { EntityBase } from "../../entity";

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
}
