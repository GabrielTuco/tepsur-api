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
import { Sede } from "../../Sede/entity";
import { Grupo } from "../../Matricula/entity";
import { MatriculaEspecializacion } from "../../Especializacion/entity/MatriculaEspecializacion.entity";

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

    @Column({ default: true })
    estado: boolean;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @ManyToOne(() => Sede, (sede) => sede.docentes, { nullable: true })
    sede: Sede;

    @OneToMany(() => Grupo, (grupo) => grupo.docente, { nullable: true })
    grupos: Grupo[];

    @OneToMany(
        () => MatriculaEspecializacion,
        (matriculaEspe) => matriculaEspe.docente
    )
    matriculas_especializacion: MatriculaEspecializacion[];
}
