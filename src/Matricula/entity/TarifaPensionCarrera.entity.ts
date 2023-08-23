import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { Carrera } from "./Carrera.entity";
import { Sede } from "../../Sede/entity";
import { MODALIDAD } from "../../interfaces/enums";

@Entity()
export class TarifaPensionCarrera extends EntityBase {
    @ManyToOne(() => Sede, (sede) => sede.tarifas)
    sede: Sede;

    @ManyToOne(() => Carrera, (carrera) => carrera.tarifas)
    carrera: Carrera;

    @Column({ type: "varchar", default: MODALIDAD.VIRTUAL })
    modalidad: MODALIDAD;

    @Column()
    tarifa: number;
}
