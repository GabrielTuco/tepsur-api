import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Carrera } from "./Carrera.entity";
import { Horario } from "./Horario.entity";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { ESTADO_GRUPO, MODALIDAD } from "../../interfaces/enums";
import { MatriculaGruposGrupo } from "./MatriculaGruposGrupo.entity";
import { Modulo } from "./Modulo.entity";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity";

@Entity()
export class Grupo extends EntityBase {
    @Column()
    nombre: string;

    @Column()
    fecha_inicio: Date;

    @Column({ type: "varchar", default: ESTADO_GRUPO.EN_CURSO })
    estado: ESTADO_GRUPO;

    @Column({ nullable: true, default: 60 })
    cupos_maximos: number;

    @Column({ type: "varchar" })
    modalidad: MODALIDAD;

    @ManyToOne(() => Horario, (horario) => horario.grupos)
    horario: Horario;

    @ManyToOne(() => Carrera, (carrera) => carrera.grupos)
    carrera: Carrera;

    @ManyToOne(() => Docente, (docente) => docente.grupos)
    docente: Docente;

    @ManyToOne(() => Modulo, (modulo) => modulo.grupos)
    modulo: Modulo;

    @ManyToOne(() => Secretaria, (secretaria) => secretaria.grupos)
    secretaria: Secretaria;

    @ManyToOne(() => Sede, (sede) => sede.grupos)
    sede: Sede;

    @OneToMany(
        () => MatriculaGruposGrupo,
        (matriculaGruposGrupo) => matriculaGruposGrupo.matricula
    )
    matriculaGruposGrupo: MatriculaGruposGrupo[];
}
