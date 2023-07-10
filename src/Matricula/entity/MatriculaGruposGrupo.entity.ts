import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { CONDICION_ALUMNO } from "../../interfaces/enums";
import { Matricula } from "./Matricula.entity";
import { Grupo } from "./Grupo.entity";

@Entity()
export class MatriculaGruposGrupo extends BaseEntity {
    @PrimaryColumn()
    matriculaUuid: string;

    @PrimaryColumn()
    grupoUuid: string;

    @Column()
    condicion: CONDICION_ALUMNO;

    @ManyToOne(() => Matricula, (matricula) => matricula.matriculaGruposGrupo)
    matricula: Matricula;

    @ManyToOne(() => Grupo, (grupo) => grupo.matriculaGruposGrupo)
    grupo: Grupo;
}
