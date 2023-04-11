import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Usuario } from "../Auth/entity/Usuario.entity";
import { Sede } from "./Sede.entity";

@Entity()
export class Docente extends EntityBase {
    @Column({ length: 8 })
    dni: string;

    @Column()
    nombre: string;

    @Column()
    ape_paterno: string;

    @Column()
    ape_materno: string;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @ManyToOne(() => Sede, (sede) => sede.docentes)
    sede: Sede;
}
