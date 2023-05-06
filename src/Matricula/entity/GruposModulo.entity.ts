import { Column, Entity, ManyToOne } from "typeorm";
import { Grupo } from "./Grupo.entity";
import { Modulo } from "./Modulo.entity";
import { EntityBase } from "../../entity";

@Entity()
export class GruposModulo extends EntityBase {
    @Column()
    fecha_inicio: Date;

    @Column()
    nro_estudiantes: number;

    @ManyToOne(() => Grupo, (grupo) => grupo.grupo_modulo)
    grupo: Grupo;

    @ManyToOne(() => Modulo, (modulo) => modulo.grupo_modulo)
    modulo: Modulo;
}
