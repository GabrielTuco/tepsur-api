import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { EntityBase } from "./EntityBase";
import { Usuario } from "../Auth/entity/Usuario.entity";
import { Sede } from "../Sede/entity/Sede.entity";

@Entity()
export class Docente extends EntityBase {
    @Column({ length: 8, unique: true })
    dni: string;

    @Column()
    nombres: string;

    @Column()
    ape_paterno: string;

    @Column()
    ape_materno: string;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @ManyToOne(() => Sede, (sede) => sede.docentes, { nullable: true })
    sede: Sede;
}
