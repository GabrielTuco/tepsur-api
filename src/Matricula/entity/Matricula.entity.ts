import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { Carrera, Carrera as Grupo } from "./Carrera.entity";
import { Alumno, Alumno as Modulo } from "../../Student/entity/Alumno.entity";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { PagoMatricula } from "./PagoMatricula.entity";

@Entity()
export class Matricula extends EntityBase {
    @Column()
    uuid: string;

    @ManyToOne(() => Carrera, (carrera) => carrera.matriculas)
    carrera: Carrera;

    @OneToOne(() => Alumno)
    @JoinColumn()
    alumno: Alumno;

    @ManyToOne(() => Grupo, (grupo) => grupo.matriculas)
    grupo: Grupo;

    @OneToOne(() => Modulo)
    @JoinColumn()
    modulo: Modulo;

    @ManyToOne(() => Secretaria, (secretaria) => secretaria.matriculas)
    secretaria: Secretaria;

    @ManyToOne(() => Sede, (sede) => sede.matriculas)
    sede: Sede;

    @OneToOne(() => PagoMatricula, { nullable: true })
    @JoinColumn()
    pagoMatricula: PagoMatricula;

    @Column()
    fecha_inscripcion: Date;
}
