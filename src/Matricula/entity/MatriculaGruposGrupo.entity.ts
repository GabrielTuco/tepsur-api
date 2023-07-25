import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { CONDICION_ALUMNO } from "../../interfaces/enums";
import { Matricula } from "./Matricula.entity";
import { Grupo } from "./Grupo.entity";
import { Secretaria } from "../../Secretary/entity";

@Entity()
export class MatriculaGruposGrupo extends BaseEntity {
    @PrimaryColumn()
    matriculaUuid: string;

    @PrimaryColumn()
    grupoUuid: string;

    @Column({ type: "varchar" })
    condicion: CONDICION_ALUMNO;

    @ManyToOne(() => Matricula, (matricula) => matricula.matriculaGruposGrupo)
    matricula: Matricula;

    @ManyToOne(() => Grupo, (grupo) => grupo.matriculaGruposGrupo)
    grupo: Grupo;

    @ManyToOne(
        () => Secretaria,
        (secretaria) => secretaria.matricula_grupos_grupo
    )
    responsable: Secretaria;
}
