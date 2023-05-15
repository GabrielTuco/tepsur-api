import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Usuario } from "../../Auth/entity/Usuario.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { Grupo } from "../../Matricula/entity";

@Entity()
export class Docente extends EntityBase {
    @Column({ unique: true })
    uuid: string;

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

    @OneToMany(() => Grupo, (grupo) => grupo.docente, { nullable: true })
    grupos: Grupo[];
}
