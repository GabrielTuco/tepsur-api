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
import { Grupo, Matricula, MatriculaGruposGrupo } from "../../Matricula/entity";
import { MatriculaEspecializacion } from "../../Especializacion/entity/MatriculaEspecializacion.entity";

@Entity()
export class Secretaria extends EntityBase {
    @Column({ length: 8, unique: true })
    dni: string;

    @Column()
    nombres: string;

    @Column()
    ape_paterno: string;

    @Column()
    ape_materno: string;

    @Column({ nullable: true, length: 9 })
    celular: string;

    @Column({ nullable: true })
    correo: string;

    @Column({ nullable: true, default: true })
    estado: boolean;

    @OneToOne(() => Usuario, { nullable: true })
    @JoinColumn()
    usuario: Usuario;

    @ManyToOne(() => Sede, (sede) => sede.secretarias)
    sede: Sede;

    @OneToMany(() => Matricula, (matricula) => matricula.secretaria)
    matriculas: Matricula[];

    @OneToMany(
        () => MatriculaEspecializacion,
        (matriculaEspe) => matriculaEspe.secretaria
    )
    matriculas_especializacion: MatriculaEspecializacion[];

    @OneToMany(() => Grupo, (grupo) => grupo.secretaria)
    grupos: Grupo[];

    @OneToMany(
        () => MatriculaGruposGrupo,
        (matriculaGrupo) => matriculaGrupo.responsable
    )
    matricula_grupos_grupo: MatriculaGruposGrupo[];
}
