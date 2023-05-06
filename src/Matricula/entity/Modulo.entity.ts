import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { GruposModulo } from "./GruposModulo.entity";

@Entity()
export class Modulo extends EntityBase {
    @Column({ unique: true })
    uuid: string;

    @Column({ unique: true })
    nombre: string;

    @Column()
    duracion_semanas: string;

    @OneToMany(() => GruposModulo, (grupo_modulo) => grupo_modulo.modulo, {
        nullable: true,
    })
    grupo_modulo: GruposModulo[];
}
