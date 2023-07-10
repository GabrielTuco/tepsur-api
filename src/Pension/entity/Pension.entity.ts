import { Column, Entity, ManyToOne } from "typeorm";
import { Matricula } from "../../Matricula/entity";
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
