import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { EntityBase } from "../entity";
import { Modulo } from "./modulo.entity";

@Entity()
export class Carrera extends EntityBase {
    @Column()
    uuid: string;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    perfil_egreso: string;

    @Column("text", { array: true })
    url_video: string[];

    @Column({ nullable: true })
    fecha_inicio: Date;

    @Column({ nullable: true })
    fin_inscripcion: Date;

    @Column()
    duracion_meses: string;

    @Column("text", { array: true })
    images: string[];

    @ManyToMany(() => Modulo, { nullable: true })
    @JoinTable()
    modulos: Modulo[];
}
