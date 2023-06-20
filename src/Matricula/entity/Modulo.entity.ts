import { Column, Entity, ManyToOne } from "typeorm";
import { EntityBase } from "../../entity";
import { Horario } from "./Horario.entity";
import { Docente } from "../../Teacher/entity/Docente.entity";

@Entity()
export class Modulo extends EntityBase {
    @Column({ unique: true })
    nombre: string;

    @Column()
    duracion_semanas: string;

    @ManyToOne(() => Horario, (horario) => horario.modulos)
    horario: Horario;

    @ManyToOne(() => Docente, (docente) => docente.modulos)
    docente: Docente;
}
