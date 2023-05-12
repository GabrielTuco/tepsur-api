import { Column, Entity, OneToMany } from "typeorm";
import { EntityBase } from "../../entity";
import { Grupo } from "./Grupo.entity";

@Entity()
export class Horario extends EntityBase {
    @Column()
    uuid: string;

    @Column()
    turno: string;

    @Column()
    dias: string;

    @Column()
    hora_inicio: Date;

    @Column()
    hora_fin: Date;

    @OneToMany(() => Grupo, (grupo) => grupo.horario)
    grupos: Grupo[];
}
