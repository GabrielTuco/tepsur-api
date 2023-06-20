import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Carrera } from "./Carrera.entity";
import { Horario } from "./Horario.entity";
import { Docente } from "../../Teacher/entity/Docente.entity";
import { Matricula } from "./Matricula.entity";
import { ESTADO_GRUPO } from "../../interfaces/enums";

@Entity()
export class Grupo extends EntityBase {
    @Column()
    nombre: string;

    @Column()
    fecha_inicio: Date;

    @Column({ default: ESTADO_GRUPO.ABIERTO })
    estado: ESTADO_GRUPO;

    @Column({ nullable: true, default: 60 })
    cupos_maximos: number;

    @ManyToOne(() => Horario, (horario) => horario.grupos)
    horario: Horario;

    @ManyToOne(() => Carrera, (carrera) => carrera.grupos)
    carrera: Carrera;

    @ManyToOne(() => Docente, (docente) => docente.grupos)
    docente: Docente;

    @OneToMany(() => Matricula, (matricula) => matricula.grupo, {
        nullable: true,
    })
    matriculas: Matricula[];
}
