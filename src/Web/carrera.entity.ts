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
    url_video: string[];

    @Column()
    fecha_inicio: Date;

    @Column()
    fin_inscripcion: Date;

    @Column()
    duracion_meses: number;

    @Column()
    images: string[];

    @ManyToMany(() => Modulo)
    @JoinTable()
    modulos: Modulo[];
}
