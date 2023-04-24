import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { EntityBase } from "../entity";
import { Modulo } from "./modulo.entity";

@Entity()
export class Carrera extends EntityBase {
    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    perfil_egreso: string;

    @Column()
    url_video: string;

    @ManyToMany(() => Modulo)
    @JoinTable()
    modulos: Modulo[];
}
