import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { Alumno } from "../../Student/entity";
import { Especializacion } from "./Especializacion.entity";
import { Sede } from "../../Sede/entity";
import { Horario } from "../../Matricula/entity";
import { Docente } from "../../Teacher/entity";

@Entity()
export class MatriculaEspecializacion extends EntityBase {
    @ManyToOne(() => Alumno, (alumno) => alumno.matriculas_especializacion)
    alumno: Alumno;

    @ManyToOne(
        () => Especializacion,
        (especializacion) => especializacion.matriculas_especializacion
    )
    especializacion: Especializacion;

    @ManyToOne(() => Sede, (sede) => sede.matriculas_especializacion)
    sede: Sede;

    @OneToOne(() => Horario, { nullable: true })
    @JoinColumn()
    horario: Horario;

    @ManyToOne(() => Docente, (docente) => docente.matriculas_especializacion, {
        nullable: true,
    })
    docente: Docente;

    @Column()
    fecha_inicio: Date;
}
