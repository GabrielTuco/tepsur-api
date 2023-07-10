import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { Grupo } from "./Grupo.entity";
import { DIAS } from "../../interfaces/enums";

@Entity()
export class Horario extends EntityBase {
    @Column("text", { array: true })
    dias: DIAS[]; //['Lun','Mar','Mie']

    @Column()
    hora_inicio: string; // hh:mm en formato de 24 horas

    @Column()
    hora_fin: string; // hh:mm en formato de 24 horas

    @Column({ default: true })
    estado: boolean;

    @OneToMany(() => Grupo, (grupo) => grupo.horario)
    grupos: Grupo[];
}
