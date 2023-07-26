import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { Alumno } from "../../Student/entity";
import { Especializacion } from "./Especializacion.entity";
import { Sede } from "../../Sede/entity";
import { Horario, PagoMatricula } from "../../Matricula/entity";
import { Docente } from "../../Teacher/entity";
import { Secretaria } from "../../Secretary/entity";
import { MODALIDAD } from "../../interfaces/enums";

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

    @ManyToOne(
        () => Secretaria,
        (secretaria) => secretaria.matriculas_especializacion
    )
    secretaria: Secretaria;

    @OneToOne(() => PagoMatricula, { nullable: true })
    @JoinColumn()
    pagoMatricula: PagoMatricula;

    @Column({ type: "varchar", nullable: true })
    modalidad: MODALIDAD;

    @Column()
    fecha_inscripcion: Date;

    @Column()
    fecha_inicio: Date;
}
