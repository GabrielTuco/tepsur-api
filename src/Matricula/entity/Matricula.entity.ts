import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
} from "typeorm";
import { EntityBase } from "../../entity";
import { Carrera } from "./Carrera.entity";
import { Alumno } from "../../Student/entity/Alumno.entity";
import { Secretaria } from "../../Secretary/entity/Secretaria.entity";
import { Sede } from "../../Sede/entity/Sede.entity";
import { PagoMatricula } from "./PagoMatricula.entity";
import { Grupo } from "./Grupo.entity";
import { Modulo } from "./Modulo.entity";
import { Pension } from "../../Pension/entity/Pension.entity";

@Entity()
export class Matricula extends EntityBase {
    @ManyToOne(() => Carrera, (carrera) => carrera.matriculas)
    carrera: Carrera;

    @OneToOne(() => Alumno)
    @JoinColumn()
    alumno: Alumno;

    @ManyToOne(() => Grupo, (grupo) => grupo.matriculas)
    grupo: Grupo;

    @OneToOne(() => Modulo, { nullable: true })
    @JoinColumn()
    modulo: Modulo;

    @ManyToOne(() => Secretaria, (secretaria) => secretaria.matriculas)
    secretaria: Secretaria;

    @ManyToOne(() => Sede, (sede) => sede.matriculas)
    sede: Sede;

    @OneToOne(() => PagoMatricula, { nullable: true })
    @JoinColumn()
    pagoMatricula: PagoMatricula;

    @OneToMany(() => Pension, (pension) => pension.matricula)
    pensiones: Pension[];

    @Column()
    fecha_inscripcion: Date;

    @Column()
    fecha_inicio: Date;
}
