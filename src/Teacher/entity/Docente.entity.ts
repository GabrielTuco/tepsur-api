import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Usuario } from "../../Auth/entity/Usuario.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { Grupo, Modulo } from "../../Matricula/entity";

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

    @OneToMany(() => Grupo, (grupo) => grupo.docente, { nullable: true })
    grupos: Grupo[];

    @OneToMany(() => Modulo, (modulo) => modulo.horario)
    modulos: Modulo[];
}
