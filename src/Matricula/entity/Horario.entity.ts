import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { EntityBase } from "../../entity";
import { Grupo } from "./Grupo.entity";

@Entity()
export class Horario extends EntityBase {
    @Column({ unique: true })
    uuid: string;

    @Column("text", { array: true })
    dias: string[];

    @Column()
    hora_inicio: string; // hh:mm en formato de 24 horas

    @Column()
    hora_fin: string; // hh:mm en formato de 24 horas

    @Column({ default: true })
    estado: boolean;

    @OneToMany(() => Grupo, (grupo) => grupo.horario)
    grupos: Grupo[];
}
