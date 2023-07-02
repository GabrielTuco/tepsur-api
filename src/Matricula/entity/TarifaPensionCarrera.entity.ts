import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { Carrera } from "./Carrera.entity";

@Entity()
export class TarifaPensionCarrera extends EntityBase {
    @OneToOne(() => Carrera)
    @JoinColumn()
    carrera: Carrera;

    @Column()
    tarifa: number;
}
