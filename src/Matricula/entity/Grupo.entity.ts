import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "../../entity/EntityBase";
import { Carrera } from "./Carrera.entity";
import { Horario } from "./Horario.entity";
import { Docente } from "../../Teacher/entity/Docente.entity";

@Entity()
export class Grupo extends EntityBase {
    @Column({ unique: true })
    uuid: string;

    @Column()
    nombre: string;

    @Column()
    fecha_inicio: Date;

    @Column({ default: "ABIERTO" }) //EN_CURSO CERRADO
    estado: string;

    @ManyToOne(() => Horario, (horario) => horario.grupos)
    horario: Horario;

    @ManyToOne(() => Carrera, (carrera) => carrera.grupos)
    carrera: Carrera;

    @ManyToOne(() => Docente, (docente) => docente.grupos)
    docente: Docente;
}
