import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Carrera } from "./Carrera.entity";
import { GruposModulo } from "./GruposModulo.entity";

@Entity()
export class Grupo extends EntityBase {
    @Column({ unique: true })
    uuid: string;

    @Column()
    nombre: string;

    @Column()
    fecha_inicio: Date;

    @Column()
    horario: string;

    @ManyToOne(() => Carrera, (carrera) => carrera.grupos)
    carrera: Carrera;

    @OneToMany(() => GruposModulo, (grupo_modulo) => grupo_modulo.grupo)
    grupo_modulo: GruposModulo[];
}
